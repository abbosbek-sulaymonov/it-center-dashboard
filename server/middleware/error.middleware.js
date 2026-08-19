import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

export function notFoundHandler(req, _res, next) {
  next(ApiError.notFound(`No API route matches ${req.method} ${req.originalUrl}`));
}

/**
 * Single exit point for failures. Mongoose's own error shapes are translated
 * here so the rest of the codebase can just `throw`.
 */
// The unused `_next` is required: Express identifies error middleware by arity.
export function errorHandler(error, _req, res, _next) {
  const normalized = normalizeError(error);

  if (normalized.statusCode >= 500) {
    console.error('[api] Unhandled error:', error);
  }

  const body = {
    success: false,
    message: normalized.message,
  };
  if (normalized.details) body.details = normalized.details;
  if (!env.isProduction && normalized.statusCode >= 500) body.stack = error.stack;

  res.status(normalized.statusCode).json(body);
}

function normalizeError(error) {
  if (error instanceof ApiError) {
    return { statusCode: error.statusCode, message: error.message, details: error.details };
  }

  // Invalid ObjectId in a path parameter.
  if (error.name === 'CastError') {
    return { statusCode: 400, message: `Invalid value for "${error.path}"` };
  }

  if (error.name === 'ValidationError') {
    return {
      statusCode: 400,
      message: 'Validation failed',
      details: Object.values(error.errors).map((item) => ({
        field: item.path,
        message: item.message,
      })),
    };
  }

  // Unique index violation.
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue ?? {})[0] ?? 'field';
    return { statusCode: 409, message: `A record with this ${field} already exists` };
  }

  return { statusCode: error.statusCode ?? 500, message: error.message || 'Internal server error' };
}
