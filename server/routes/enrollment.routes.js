import { Router } from 'express';

import * as enrollmentController from '../controllers/enrollment.controller.js';
import { requireAuth, requireTutor } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { idParams } from '../validators/common.validator.js';
import {
  createEnrollmentSchema,
  listEnrollmentsQuerySchema,
  updateEnrollmentSchema,
} from '../validators/enrollment.validator.js';

const router = Router();

router.get(
  '/',
  requireAuth,
  requireTutor,
  validate({ query: listEnrollmentsQuerySchema }),
  enrollmentController.list,
);

router.post('/', requireAuth, validate({ body: createEnrollmentSchema }), enrollmentController.create);

// Progress and status are graded by staff.
router.patch(
  '/:id',
  requireAuth,
  requireTutor,
  validate({ params: idParams, body: updateEnrollmentSchema }),
  enrollmentController.update,
);

// A student may drop their own place; the controller enforces ownership.
router.delete('/:id', requireAuth, validate({ params: idParams }), enrollmentController.cancel);

export default router;
