import { Router } from 'express';

import * as courseController from '../controllers/course.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { idParams } from '../validators/common.validator.js';
import {
  createCourseSchema,
  listCoursesQuerySchema,
  updateCourseSchema,
} from '../validators/course.validator.js';

const router = Router();

// Public catalogue.
router.get('/', validate({ query: listCoursesQuerySchema }), courseController.list);
router.get('/categories', courseController.categories);
router.get('/:id', validate({ params: idParams }), courseController.detail);

// Admin management.
router.post('/', requireAuth, requireAdmin, validate({ body: createCourseSchema }), courseController.create);
router.patch(
  '/:id',
  requireAuth,
  requireAdmin,
  validate({ params: idParams, body: updateCourseSchema }),
  courseController.update,
);
router.delete('/:id', requireAuth, requireAdmin, validate({ params: idParams }), courseController.remove);

export default router;
