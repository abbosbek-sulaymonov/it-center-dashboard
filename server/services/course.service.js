import { Course, Enrollment } from '../models/index.js';
import { ApiError } from '../utils/apiError.js';
import { buildPaginationMeta, escapeRegExp, resolvePagination } from '../utils/pagination.js';

const TUTOR_POPULATE = {
  path: 'tutor',
  select: 'specialization experienceYears',
  populate: { path: 'user', select: 'fullName email avatarUrl' },
};

/** Turns query-string filters into a Mongo filter document. */
function buildFilter({ search, category, level, tutor, includeInactive }) {
  const filter = {};
  if (!includeInactive) filter.isActive = true;
  if (category) filter.category = category;
  if (level) filter.level = level;
  if (tutor) filter.tutor = tutor;

  if (search) {
    const pattern = new RegExp(escapeRegExp(search), 'i');
    filter.$or = [{ title: pattern }, { description: pattern }, { category: pattern }];
  }

  return filter;
}

export async function listCourses(query = {}) {
  const { page, limit, skip } = resolvePagination(query);
  const filter = buildFilter(query);

  const [items, total] = await Promise.all([
    Course.find(filter).populate(TUTOR_POPULATE).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Course.countDocuments(filter),
  ]);

  return { items, meta: buildPaginationMeta({ page, limit, total }) };
}

export async function getCourseById(id) {
  const course = await Course.findById(id).populate(TUTOR_POPULATE);
  if (!course) throw ApiError.notFound('Course not found');
  return course;
}

export async function createCourse(payload) {
  const course = await Course.create(payload);
  return course.populate(TUTOR_POPULATE);
}

export async function updateCourse(id, payload) {
  const course = await Course.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).populate(
    TUTOR_POPULATE,
  );
  if (!course) throw ApiError.notFound('Course not found');
  return course;
}

/**
 * Soft delete. Courses stay in the database so historical enrollments keep
 * resolving, they simply drop out of the public catalogue.
 */
export async function deactivateCourse(id) {
  const course = await Course.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!course) throw ApiError.notFound('Course not found');
  return course;
}

export async function listCategories() {
  return Course.distinct('category', { isActive: true, category: { $ne: '' } });
}

/** Courses owned by one tutor, with their current enrollment counts. */
export async function listCoursesByTutor(tutorId, query = {}) {
  const result = await listCourses({ ...query, tutor: tutorId, includeInactive: true });

  const counts = await Enrollment.aggregate([
    { $match: { course: { $in: result.items.map((course) => course._id) } } },
    { $group: { _id: '$course', total: { $sum: 1 } } },
  ]);
  const countByCourse = new Map(counts.map((entry) => [String(entry._id), entry.total]));

  return {
    ...result,
    items: result.items.map((course) => ({
      ...course.toJSON(),
      enrollmentCount: countByCourse.get(String(course._id)) ?? 0,
    })),
  };
}
