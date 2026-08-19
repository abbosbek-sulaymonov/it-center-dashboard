import { z } from 'zod';

import { email, fullName, optionalUrl, password, phone } from './common.validator.js';

export const signupSchema = z.object({
  fullName,
  email,
  password,
  phone,
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  fullName: fullName.optional(),
  phone,
  avatarUrl: optionalUrl,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: password,
});
