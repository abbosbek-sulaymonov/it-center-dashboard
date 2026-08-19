import { ROLES } from '../config/constants.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import * as enrollmentService from '../services/enrollment.service.js';
import * as studentService from '../services/student.service.js';
import { ApiError } from '../utils/apiError.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';

export const list = asyncHandler(async (req, res) => {
  const { items, meta } = await enrollmentService.listEnrollments(req.query);
  return sendSuccess(res, { data: items, meta });
});

/**
 * Students enrol themselves; only an admin may name a different student.
 */
export const create = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === ROLES.ADMIN;

  if (req.body.student && !isAdmin) throw ApiError.forbidden();

  const studentId = req.body.student ?? (await studentService.getStudentByUserId(req.user._id))._id;

  const enrollment = await enrollmentService.enroll({ studentId, courseId: req.body.course });
  return sendCreated(res, enrollment, 'Enrolled');
});

export const update = asyncHandler(async (req, res) => {
  const enrollment = await enrollmentService.updateEnrollment(req.params.id, req.body);
  return sendSuccess(res, { data: enrollment, message: 'Enrollment updated' });
});

export const cancel = asyncHandler(async (req, res) => {
  // Non-admins may only cancel a place that belongs to them.
  const studentId =
    req.user.role === ROLES.ADMIN ? undefined : (await studentService.getStudentByUserId(req.user._id))._id;

  await enrollmentService.cancelEnrollment(req.params.id, { studentId });
  return sendSuccess(res, { message: 'Enrollment cancelled' });
});
