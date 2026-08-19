import { asyncHandler } from '../middleware/asyncHandler.js';
import * as courseService from '../services/course.service.js';
import * as statsService from '../services/stats.service.js';
import * as studentService from '../services/student.service.js';
import * as tutorService from '../services/tutor.service.js';
import { Course } from '../models/index.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';

export const list = asyncHandler(async (req, res) => {
  const { items, meta } = await tutorService.listTutors(req.query);
  return sendSuccess(res, { data: items, meta });
});

export const detail = asyncHandler(async (req, res) => {
  return sendSuccess(res, { data: await tutorService.getTutorById(req.params.id) });
});

export const create = asyncHandler(async (req, res) => {
  const tutor = await tutorService.createTutor(req.body);
  return sendCreated(res, tutor, 'Tutor created');
});

export const update = asyncHandler(async (req, res) => {
  const tutor = await tutorService.updateTutor(req.params.id, req.body);
  return sendSuccess(res, { data: tutor, message: 'Tutor updated' });
});

export const remove = asyncHandler(async (req, res) => {
  await tutorService.deactivateTutor(req.params.id);
  return sendSuccess(res, { message: 'Tutor removed' });
});

/** Courses owned by the signed-in tutor. */
export const myCourses = asyncHandler(async (req, res) => {
  const tutor = await tutorService.getTutorByUserId(req.user._id);
  const { items, meta } = await courseService.listCoursesByTutor(tutor._id, req.query);
  return sendSuccess(res, { data: items, meta });
});

/** Everyone enrolled on any course the signed-in tutor owns. */
export const myStudents = asyncHandler(async (req, res) => {
  const tutor = await tutorService.getTutorByUserId(req.user._id);
  const courseIds = await Course.find({ tutor: tutor._id }).distinct('_id');
  const enrollments = await studentService.listStudentsForCourses(courseIds);
  return sendSuccess(res, { data: enrollments });
});

export const myStats = asyncHandler(async (req, res) => {
  const tutor = await tutorService.getTutorByUserId(req.user._id);
  return sendSuccess(res, { data: await statsService.getTutorStats(tutor._id) });
});
