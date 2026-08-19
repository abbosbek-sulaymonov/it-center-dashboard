import { ApiError } from '../utils/apiError.js';

/**
 * Validates `body`, `query` and `params` against the supplied Zod schemas and
 * replaces each part with the parsed result, so controllers receive coerced,
 * trimmed values instead of raw strings.
 */
export function validate(schemas = {}) {
  return (req, _res, next) => {
    for (const part of ['body', 'query', 'params']) {
      const schema = schemas[part];
      if (!schema) continue;

      const result = schema.safeParse(req[part]);
      if (!result.success) {
        return next(ApiError.badRequest('Validation failed', formatIssues(result.error)));
      }

      // Express 5 exposes `query` as a getter, so it is redefined rather than assigned.
      if (part === 'query') {
        Object.defineProperty(req, 'query', { value: result.data, writable: true, configurable: true });
      } else {
        req[part] = result.data;
      }
    }
    next();
  };
}

function formatIssues(error) {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || '(root)',
    message: issue.message,
  }));
}
