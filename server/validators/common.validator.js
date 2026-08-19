import { z } from 'zod';

import { PAGINATION } from '../config/constants.js';

/** A 24-character hex Mongo ObjectId. */
export const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Must be a valid id');

export const idParams = z.object({ id: objectId });

export const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(PAGINATION.DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(PAGINATION.MAX_LIMIT).default(PAGINATION.DEFAULT_LIMIT),
});

export const searchQuery = z.object({
  search: z.string().trim().max(120).optional(),
});

export const email = z.string().trim().toLowerCase().email('Must be a valid email address');

export const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters');

export const fullName = z.string().trim().min(2, 'Name is too short').max(120);

export const phone = z.string().trim().max(32).optional();

/** Accepts an empty string, a relative path or an absolute http(s) URL. */
export const optionalUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => value === '' || /^(https?:\/\/|\/)/.test(value), 'Must be a valid URL')
  .optional();

/** Query flags arrive as strings; treat the literal "true" as enabled. */
export const booleanFlag = z
  .enum(['true', 'false'])
  .transform((value) => value === 'true')
  .optional();
