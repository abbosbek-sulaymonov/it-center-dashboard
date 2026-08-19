import { asyncHandler } from '../middleware/asyncHandler.js';
import * as bookService from '../services/book.service.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';

export const list = asyncHandler(async (req, res) => {
  const { items, meta } = await bookService.listBooks(req.query);
  return sendSuccess(res, { data: items, meta });
});

export const categories = asyncHandler(async (_req, res) => {
  return sendSuccess(res, { data: await bookService.listCategories() });
});

export const detail = asyncHandler(async (req, res) => {
  return sendSuccess(res, { data: await bookService.getBookById(req.params.id) });
});

export const create = asyncHandler(async (req, res) => {
  const book = await bookService.createBook(req.body);
  return sendCreated(res, book, 'Book created');
});

export const update = asyncHandler(async (req, res) => {
  const book = await bookService.updateBook(req.params.id, req.body);
  return sendSuccess(res, { data: book, message: 'Book updated' });
});

export const remove = asyncHandler(async (req, res) => {
  await bookService.deactivateBook(req.params.id);
  return sendSuccess(res, { message: 'Book removed' });
});
