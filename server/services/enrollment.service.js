import { ENROLLMENT_STATUS } from '../config/constants.js';
import { Course, Enrollment } from '../models/index.js';
import { ApiError } from '../utils/apiError.js';
import { buildPaginationMeta, resolvePagination } from '../utils/pagination.js';

const POPULATE = [
  {
    path: 'course',
    select: 'title description imageUrl level category price durationWeeks tutor',
    populate: { path: 'tutor', select: 'specialization', populate: { path: 'user', select: 'fullName' } },
  },
  {
    path: 'student',
    select: 'group',
    populate: { path: 'user', select: 'fullName email avatarUrl' },
  },
];

export async function listEnrollments(query = {}) {
  const { page, limit, skip } = resolvePagination(query);

  const filter = {};
  if (query.student) filter.student = query.student;
  if (query.course) filter.course = query.course;
  if (query.status) filter.status = query.status;

  const [items, total] = await Promise.all([
    Enrollment.find(filter).populate(POPULATE).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Enrollment.countDocuments(filter),
  ]);

  return { items, meta: buildPaginationMeta({ page, limit, total }) };
}

/**
 * Enrolls a student, refusing when the course is full or already taken.
 * A previously cancelled enrollment is reactivated instead of duplicated.
 */
export async function enroll({ studentId, courseId }) {
  const course = await Course.findById(courseId);
  if (!course || !course.isActive) throw ApiError.notFound('Course not found');

  const existing = await Enrollment.findOne({ student: studentId, course: courseId });
  if (existing && existing.status !== ENROLLMENT_STATUS.CANCELLED) {
    throw ApiError.conflict('You are already enrolled on this course');
  }

  const activeCount = await Enrollment.countDocuments({
    course: courseId,
    status: { $in: [ENROLLMENT_STATUS.PENDING, ENROLLMENT_STATUS.ACTIVE] },
  });
  if (activeCount >= course.capacity) throw ApiError.conflict('This course is already full');

  if (existing) {
    existing.status = ENROLLMENT_STATUS.PENDING;
    existing.progress = 0;
    existing.completedAt = null;
    existing.enrolledAt = new Date();
    await existing.save();
    return existing.populate(POPULATE);
  }

  const enrollment = await Enrollment.create({ student: studentId, course: courseId });
  return enrollment.populate(POPULATE);
}

export async function updateEnrollment(id, { status, progress }) {
  const enrollment = await Enrollment.findById(id);
  if (!enrollment) throw ApiError.notFound('Enrollment not found');

  if (status) enrollment.status = status;
  if (progress !== undefined) enrollment.progress = progress;

  // Reaching 100% and being marked complete are kept in sync in both directions.
  if (enrollment.progress === 100 && enrollment.status === ENROLLMENT_STATUS.ACTIVE) {
    enrollment.status = ENROLLMENT_STATUS.COMPLETED;
  }
  if (enrollment.status === ENROLLMENT_STATUS.COMPLETED) {
    enrollment.progress = 100;
    enrollment.completedAt ??= new Date();
  } else {
    enrollment.completedAt = null;
  }

  await enrollment.save();
  return enrollment.populate(POPULATE);
}

export async function cancelEnrollment(id, { studentId } = {}) {
  const enrollment = await Enrollment.findById(id);
  if (!enrollment) throw ApiError.notFound('Enrollment not found');

  // Students may only cancel their own place.
  if (studentId && String(enrollment.student) !== String(studentId)) {
    throw ApiError.forbidden();
  }

  enrollment.status = ENROLLMENT_STATUS.CANCELLED;
  await enrollment.save();
  return enrollment;
}

/** Course ids the student currently holds a non-cancelled place on. */
export async function listActiveCourseIds(studentId) {
  return Enrollment.find({
    student: studentId,
    status: { $ne: ENROLLMENT_STATUS.CANCELLED },
  }).distinct('course');
}
