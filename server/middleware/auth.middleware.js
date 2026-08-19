import { ROLES } from '../config/constants.js';
import { ApiError } from '../utils/apiError.js';
import { readAuthCookie, verifyToken } from '../utils/jwt.js';
import { User } from '../models/index.js';

/** Rejects the request unless a valid session cookie maps to an active user. */
export async function requireAuth(req, _res, next) {
  try {
    const payload = verifyToken(readAuthCookie(req));
    if (!payload) throw ApiError.unauthorized('Session is missing or has expired');

    const user = await User.findById(payload.sub).select('-password');
    if (!user || !user.isActive) throw ApiError.unauthorized('Account is no longer active');

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Attaches `req.user` when a valid session exists but never rejects. Used by
 * public endpoints that render extra detail for signed-in visitors.
 */
export async function attachUser(req, _res, next) {
  try {
    const payload = verifyToken(readAuthCookie(req));
    if (payload) {
      const user = await User.findById(payload.sub).select('-password');
      if (user?.isActive) req.user = user;
    }
  } catch {
    // A broken optional session is simply treated as anonymous.
  }
  next();
}

/** Guards a route behind one or more roles. Must run after `requireAuth`. */
export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) return next(ApiError.forbidden());
    next();
  };
}

export const requireAdmin = requireRole(ROLES.ADMIN);
export const requireTutor = requireRole(ROLES.ADMIN, ROLES.TUTOR);
