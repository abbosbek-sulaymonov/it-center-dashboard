/**
 * Wraps an async route handler so a rejected promise reaches Express's error
 * pipeline instead of hanging the request.
 */
export function asyncHandler(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}
