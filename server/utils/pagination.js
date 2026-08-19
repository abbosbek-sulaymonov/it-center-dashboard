import { PAGINATION } from '../config/constants.js';

/** Clamps user-supplied paging values into something safe to hand Mongo. */
export function resolvePagination({ page, limit } = {}) {
  const parsedPage = Math.max(Number.parseInt(page, 10) || PAGINATION.DEFAULT_PAGE, 1);
  const parsedLimit = Math.min(
    Math.max(Number.parseInt(limit, 10) || PAGINATION.DEFAULT_LIMIT, 1),
    PAGINATION.MAX_LIMIT,
  );

  return { page: parsedPage, limit: parsedLimit, skip: (parsedPage - 1) * parsedLimit };
}

export function buildPaginationMeta({ page, limit, total }) {
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  return {
    page,
    limit,
    total,
    totalPages,
    hasPrevPage: page > 1,
    hasNextPage: page < totalPages,
  };
}

/** Escapes a raw search term so it can be dropped into a `$regex` safely. */
export function escapeRegExp(value = '') {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
