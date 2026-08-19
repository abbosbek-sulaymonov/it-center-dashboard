import { Book } from '../models/index.js';
import { ApiError } from '../utils/apiError.js';
import { buildPaginationMeta, escapeRegExp, resolvePagination } from '../utils/pagination.js';

function buildFilter({ search, category, includeInactive }) {
  const filter = {};
  if (!includeInactive) filter.isActive = true;
  if (category) filter.category = category;

  if (search) {
    const pattern = new RegExp(escapeRegExp(search), 'i');
    filter.$or = [{ title: pattern }, { author: pattern }, { description: pattern }];
  }

  return filter;
}

export async function listBooks(query = {}) {
  const { page, limit, skip } = resolvePagination(query);
  const filter = buildFilter(query);

  const [items, total] = await Promise.all([
    Book.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Book.countDocuments(filter),
  ]);

  return { items, meta: buildPaginationMeta({ page, limit, total }) };
}

export async function getBookById(id) {
  const book = await Book.findById(id);
  if (!book) throw ApiError.notFound('Book not found');
  return book;
}

export async function createBook(payload) {
  return Book.create(payload);
}

export async function updateBook(id, payload) {
  const book = await Book.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!book) throw ApiError.notFound('Book not found');
  return book;
}

export async function deactivateBook(id) {
  const book = await Book.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!book) throw ApiError.notFound('Book not found');
  return book;
}

export async function listCategories() {
  return Book.distinct('category', { isActive: true, category: { $ne: '' } });
}
