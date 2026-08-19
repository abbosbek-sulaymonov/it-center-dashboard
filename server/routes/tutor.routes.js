import { Router } from 'express';

import * as tutorController from '../controllers/tutor.controller.js';
import { requireAdmin, requireAuth, requireRole } from '../middleware/auth.middleware.js';
import { ROLES } from '../config/constants.js';
import { validate } from '../middleware/validate.middleware.js';
import { idParams, paginationQuery } from '../validators/common.validator.js';
import {
  createTutorSchema,
  listPeopleQuerySchema,
  updateTutorSchema,
} from '../validators/people.validator.js';

const router = Router();

// "me" routes are declared before "/:id" so they are not read as an id.
const tutorOnly = [requireAuth, requireRole(ROLES.TUTOR)];
router.get('/me/courses', ...tutorOnly, validate({ query: paginationQuery }), tutorController.myCourses);
router.get('/me/students', ...tutorOnly, tutorController.myStudents);
router.get('/me/stats', ...tutorOnly, tutorController.myStats);

// The public catalogue shows who teaches what.
router.get('/', validate({ query: listPeopleQuerySchema }), tutorController.list);
router.get('/:id', validate({ params: idParams }), tutorController.detail);

router.post('/', requireAuth, requireAdmin, validate({ body: createTutorSchema }), tutorController.create);
router.patch(
  '/:id',
  requireAuth,
  requireAdmin,
  validate({ params: idParams, body: updateTutorSchema }),
  tutorController.update,
);
router.delete('/:id', requireAuth, requireAdmin, validate({ params: idParams }), tutorController.remove);

export default router;
