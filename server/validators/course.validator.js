import { z } from 'zod';

import { COURSE_LEVEL_VALUES } from '../config/constants.js';
import { booleanFlag, objectId, optionalUrl, paginationQuery, searchQuery } from './common.validator.js';

const courseFields = {
  title: z.string().trim().min(3, 'Title is too short').max(160),
  description: z.string().trim().min(10, 'Description is too short').max(4000),
  imageUrl: optionalUrl,
  price: z.coerce.number().min(0).max(1_000_000_000),
  level: z.enum(COURSE_LEVEL_VALUES),
  category: z.string().trim().max(80).optional(),
  durationWeeks: z.coerce.number().int().min(1).max(104),
  capacity: z.coerce.number().int().min(1).max(500),
  // An empty string from a cleared <Select> means "no tutor".
  tutor: z
    .union([objectId, z.literal(''), z.null()])
    .transform((value) => (value === '' ? null : value))
    .optional(),
  isActive: z.boolean().optional(),
};

export const createCourseSchema = z.object(courseFields);

export const updateCourseSchema = z.object(courseFields).partial();

export const listCoursesQuerySchema = paginationQuery.merge(searchQuery).extend({
  category: z.string().trim().max(80).optional(),
  level: z.enum(COURSE_LEVEL_VALUES).optional(),
  tutor: objectId.optional(),
  includeInactive: booleanFlag,
});
