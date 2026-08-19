import { Router } from 'express';

import * as bookController from '../controllers/book.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { idParams } from '../validators/common.validator.js';
import { createBookSchema, listBooksQuerySchema, updateBookSchema } from '../validators/book.validator.js';

const router = Router();

router.get('/', validate({ query: listBooksQuerySchema }), bookController.list);
router.get('/categories', bookController.categories);
router.get('/:id', validate({ params: idParams }), bookController.detail);

router.post('/', requireAuth, requireAdmin, validate({ body: createBookSchema }), bookController.create);
router.patch(
  '/:id',
  requireAuth,
  requireAdmin,
  validate({ params: idParams, body: updateBookSchema }),
  bookController.update,
);
router.delete('/:id', requireAuth, requireAdmin, validate({ params: idParams }), bookController.remove);

export default router;
