import { ENROLLMENT_STATUS } from '../config/constants.js';
import { Book, Course, Enrollment, Student, Tutor } from '../models/index.js';

/** Headline counters for the admin dashboard. */
export async function getAdminStats() {
  const [students, tutors, courses, books, enrollments, byStatus, popularCourses] = await Promise.all([
    Student.countDocuments({ isActive: true }),
    Tutor.countDocuments({ isActive: true }),
    Course.countDocuments({ isActive: true }),
    Book.countDocuments({ isActive: true }),
    Enrollment.countDocuments({ status: { $ne: ENROLLMENT_STATUS.CANCELLED } }),
    Enrollment.aggregate([{ $group: { _id: '$status', total: { $sum: 1 } } }]),
    Enrollment.aggregate([
      { $match: { status: { $ne: ENROLLMENT_STATUS.CANCELLED } } },
      { $group: { _id: '$course', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'courses', localField: '_id', foreignField: '_id', as: 'course' } },
      { $unwind: '$course' },
      { $project: { _id: 0, courseId: '$_id', title: '$course.title', total: 1 } },
    ]),
  ]);

  return {
    totals: { students, tutors, courses, books, enrollments },
    enrollmentsByStatus: Object.fromEntries(byStatus.map((entry) => [entry._id, entry.total])),
    popularCourses,
  };
}

export async function getTutorStats(tutorId) {
  const courseIds = await Course.find({ tutor: tutorId }).distinct('_id');

  const [activeCourses, byStatus] = await Promise.all([
    Course.countDocuments({ tutor: tutorId, isActive: true }),
    Enrollment.aggregate([
      { $match: { course: { $in: courseIds } } },
      { $group: { _id: '$status', total: { $sum: 1 } } },
    ]),
  ]);

  const enrollmentsByStatus = Object.fromEntries(byStatus.map((entry) => [entry._id, entry.total]));
  const students = byStatus
    .filter((entry) => entry._id !== ENROLLMENT_STATUS.CANCELLED)
    .reduce((sum, entry) => sum + entry.total, 0);

  return { totals: { courses: activeCourses, students }, enrollmentsByStatus };
}

export async function getStudentStats(studentId) {
  const [byStatus, books, progress] = await Promise.all([
    Enrollment.aggregate([
      { $match: { student: studentId } },
      { $group: { _id: '$status', total: { $sum: 1 } } },
    ]),
    Book.countDocuments({ isActive: true }),
    Enrollment.aggregate([
      { $match: { student: studentId, status: { $ne: ENROLLMENT_STATUS.CANCELLED } } },
      { $group: { _id: null, average: { $avg: '$progress' } } },
    ]),
  ]);

  const enrollmentsByStatus = Object.fromEntries(byStatus.map((entry) => [entry._id, entry.total]));

  return {
    totals: {
      enrolled: (enrollmentsByStatus.pending ?? 0) + (enrollmentsByStatus.active ?? 0),
      completed: enrollmentsByStatus.completed ?? 0,
      books,
    },
    averageProgress: Math.round(progress[0]?.average ?? 0),
    enrollmentsByStatus,
  };
}
