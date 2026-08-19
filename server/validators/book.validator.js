import { z } from 'zod';

import { booleanFlag, optionalUrl, paginationQuery, searchQuery } from './common.validator.js';

const bookFields = {
  title: z.string().trim().min(2, 'Title is too short').max(200),
  author: z.string().trim().max(160).optional(),
  description: z.string().trim().min(10, 'Description is too short').max(4000),
  imageUrl: optionalUrl,
  fileUrl: optionalUrl,
  category: z.string().trim().max(80).optional(),
  publishedYear: z.coerce.number().int().min(1400).max(2200).nullable().optional(),
  isActive: z.boolean().optional(),
};

export const createBookSchema = z.object(bookFields);

export const updateBookSchema = z.object(bookFields).partial();

export const listBooksQuerySchema = paginationQuery.merge(searchQuery).extend({
  category: z.string().trim().max(80).optional(),
  includeInactive: booleanFlag,
});
