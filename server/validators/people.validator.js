import { z } from 'zod';

import {
  booleanFlag,
  email,
  fullName,
  password,
  paginationQuery,
  phone,
  searchQuery,
} from './common.validator.js';

export const createTutorSchema = z.object({
  fullName,
  email,
  password,
  phone,
  specialization: z.string().trim().max(160).optional(),
  bio: z.string().trim().max(2000).optional(),
  experienceYears: z.coerce.number().int().min(0).max(60).optional(),
});

export const updateTutorSchema = createTutorSchema.omit({ password: true }).partial().extend({
  isActive: z.boolean().optional(),
});

export const createStudentSchema = z.object({
  fullName,
  email,
  password,
  phone,
  group: z.string().trim().max(80).optional(),
  dateOfBirth: z.coerce.date().nullable().optional(),
  address: z.string().trim().max(400).optional(),
});

export const updateStudentSchema = createStudentSchema.omit({ password: true }).partial().extend({
  isActive: z.boolean().optional(),
});

export const listPeopleQuerySchema = paginationQuery.merge(searchQuery).extend({
  group: z.string().trim().max(80).optional(),
  includeInactive: booleanFlag,
});
