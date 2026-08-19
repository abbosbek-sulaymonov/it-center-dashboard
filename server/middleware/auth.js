// api/middleware/auth.js
import { getTokenFromCookies, verifyToken } from '../config/utils';

export function authenticateToken(handler) {
  return async (req, res) => {
    const token = getTokenFromCookies(req);

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;

    return handler(req, res);
  };
}

export function requireAdmin(handler) {
  return authenticateToken(async (req, res) => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    return handler(req, res);
  });
}
