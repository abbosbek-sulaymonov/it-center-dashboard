import jwt from 'jsonwebtoken';

import { env } from '../config/env.js';
import { AUTH_COOKIE_NAME, TOKEN_TTL, TOKEN_TTL_SECONDS } from '../config/constants.js';

export function signToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: TOKEN_TTL });
}

/** Returns the decoded payload, or `null` when the token is missing/invalid/expired. */
export function verifyToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch {
    return null;
  }
}

export function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: TOKEN_TTL_SECONDS * 1000,
  });
}

export function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    path: '/',
  });
}

export function readAuthCookie(req) {
  return req.cookies?.[AUTH_COOKIE_NAME] ?? null;
}
