import { asyncHandler } from '../middleware/asyncHandler.js';
import * as courseService from '../services/course.service.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';

export const list = asyncHandler(async (req, res) => {
  const { items, meta } = await courseService.listCourses(req.query);
  return sendSuccess(res, { data: items, meta });
});

export const categories = asyncHandler(async (_req, res) => {
  return sendSuccess(res, { data: await courseService.listCategories() });
});

export const detail = asyncHandler(async (req, res) => {
  return sendSuccess(res, { data: await courseService.getCourseById(req.params.id) });
});

export const create = asyncHandler(async (req, res) => {
  const course = await courseService.createCourse(req.body);
  return sendCreated(res, course, 'Course created');
});

export const update = asyncHandler(async (req, res) => {
  const course = await courseService.updateCourse(req.params.id, req.body);
  return sendSuccess(res, { data: course, message: 'Course updated' });
});

export const remove = asyncHandler(async (req, res) => {
  await courseService.deactivateCourse(req.params.id);
  return sendSuccess(res, { message: 'Course removed' });
});
