import { z } from 'zod';

import { ENROLLMENT_STATUS_VALUES } from '../config/constants.js';
import { objectId, paginationQuery } from './common.validator.js';

export const createEnrollmentSchema = z.object({
  course: objectId,
  // Admins may enrol on someone's behalf; students always enrol themselves.
  student: objectId.optional(),
});

export const updateEnrollmentSchema = z
  .object({
    status: z.enum(ENROLLMENT_STATUS_VALUES).optional(),
    progress: z.coerce.number().int().min(0).max(100).optional(),
  })
  .refine((value) => value.status !== undefined || value.progress !== undefined, {
    message: 'Provide a status or a progress value',
  });

export const listEnrollmentsQuerySchema = paginationQuery.extend({
  status: z.enum(ENROLLMENT_STATUS_VALUES).optional(),
  course: objectId.optional(),
  student: objectId.optional(),
});
