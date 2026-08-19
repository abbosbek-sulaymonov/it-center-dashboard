import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import * as authController from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  changePasswordSchema,
  loginSchema,
  signupSchema,
  updateProfileSchema,
} from '../validators/auth.validator.js';

const router = Router();

// Credential endpoints are the ones worth brute-forcing, so they get a limiter.
const credentialsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Try again in a few minutes.' },
});

router.post('/signup', credentialsLimiter, validate({ body: signupSchema }), authController.signup);
router.post('/login', credentialsLimiter, validate({ body: loginSchema }), authController.login);
router.post('/logout', authController.logout);

router.get('/me', requireAuth, authController.me);
router.patch('/me', requireAuth, validate({ body: updateProfileSchema }), authController.updateMe);
router.post(
  '/me/password',
  requireAuth,
  credentialsLimiter,
  validate({ body: changePasswordSchema }),
  authController.changePassword,
);

export default router;
