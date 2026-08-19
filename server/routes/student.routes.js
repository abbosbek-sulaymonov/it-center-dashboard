import { Router } from 'express';

import { ROLES } from '../config/constants.js';
import * as studentController from '../controllers/student.controller.js';
import { requireAdmin, requireAuth, requireRole, requireTutor } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { idParams } from '../validators/common.validator.js';
import { listEnrollmentsQuerySchema } from '../validators/enrollment.validator.js';
import {
  createStudentSchema,
  listPeopleQuerySchema,
  updateStudentSchema,
} from '../validators/people.validator.js';

const router = Router();

const studentOnly = [requireAuth, requireRole(ROLES.STUDENT)];
router.get(
  '/me/enrollments',
  ...studentOnly,
  validate({ query: listEnrollmentsQuerySchema }),
  studentController.myEnrollments,
);
router.get('/me/stats', ...studentOnly, studentController.myStats);

// Student records are staff-only; tutors need them for their own rosters.
router.get(
  '/',
  requireAuth,
  requireTutor,
  validate({ query: listPeopleQuerySchema }),
  studentController.list,
);
router.get('/groups', requireAuth, requireTutor, studentController.groups);
router.get('/:id', requireAuth, requireTutor, validate({ params: idParams }), studentController.detail);

router.post(
  '/',
  requireAuth,
  requireAdmin,
  validate({ body: createStudentSchema }),
  studentController.create,
);
router.patch(
  '/:id',
  requireAuth,
  requireAdmin,
  validate({ params: idParams, body: updateStudentSchema }),
  studentController.update,
);
router.delete('/:id', requireAuth, requireAdmin, validate({ params: idParams }), studentController.remove);

export default router;
