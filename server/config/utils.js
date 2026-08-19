// api/utils/jwt.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function setCookie(res, token) {
  const isProduction = process.env.NODE_ENV === 'production';

  res.setHeader(
    'Set-Cookie',
    `auth_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict${
      isProduction ? '; Secure' : ''
    }`,
  );
}

export function clearCookie(res) {
  res.setHeader('Set-Cookie', 'auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict');
}

export function getTokenFromCookies(req) {
  const cookies = req.headers.cookie;
  if (!cookies) return null;

  const authCookie = cookies.split(';').find((c) => c.trim().startsWith('auth_token='));

  if (!authCookie) return null;

  return authCookie.split('=')[1];
}
