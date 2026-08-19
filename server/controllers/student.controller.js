import { asyncHandler } from '../middleware/asyncHandler.js';
import * as enrollmentService from '../services/enrollment.service.js';
import * as statsService from '../services/stats.service.js';
import * as studentService from '../services/student.service.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';

export const list = asyncHandler(async (req, res) => {
  const { items, meta } = await studentService.listStudents(req.query);
  return sendSuccess(res, { data: items, meta });
});

export const groups = asyncHandler(async (_req, res) => {
  return sendSuccess(res, { data: await studentService.listGroups() });
});

export const detail = asyncHandler(async (req, res) => {
  return sendSuccess(res, { data: await studentService.getStudentById(req.params.id) });
});

export const create = asyncHandler(async (req, res) => {
  const student = await studentService.createStudent(req.body);
  return sendCreated(res, student, 'Student created');
});

export const update = asyncHandler(async (req, res) => {
  const student = await studentService.updateStudent(req.params.id, req.body);
  return sendSuccess(res, { data: student, message: 'Student updated' });
});

export const remove = asyncHandler(async (req, res) => {
  await studentService.deactivateStudent(req.params.id);
  return sendSuccess(res, { message: 'Student removed' });
});

/** The signed-in student's own enrollments. */
export const myEnrollments = asyncHandler(async (req, res) => {
  const student = await studentService.getStudentByUserId(req.user._id);
  const { items, meta } = await enrollmentService.listEnrollments({ ...req.query, student: student._id });
  return sendSuccess(res, { data: items, meta });
});

export const myStats = asyncHandler(async (req, res) => {
  const student = await studentService.getStudentByUserId(req.user._id);
  return sendSuccess(res, { data: await statsService.getStudentStats(student._id) });
});
