import { asyncHandler } from '../middleware/asyncHandler.js';
import * as authService from '../services/auth.service.js';
import { sendCreated, sendSuccess } from '../utils/apiResponse.js';
import { clearAuthCookie, setAuthCookie, signToken } from '../utils/jwt.js';

function issueSession(res, user) {
  setAuthCookie(res, signToken({ sub: user._id.toString(), role: user.role }));
}

export const signup = asyncHandler(async (req, res) => {
  const user = await authService.registerUser(req.body);
  issueSession(res, user);
  return sendCreated(res, { user }, 'Account created');
});

export const login = asyncHandler(async (req, res) => {
  const user = await authService.authenticate(req.body);
  issueSession(res, user);
  return sendSuccess(res, { data: { user }, message: 'Signed in' });
});

export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);
  return sendSuccess(res, { message: 'Signed out' });
});

export const me = asyncHandler(async (req, res) => {
  const { user, profile } = await authService.getProfile(req.user._id);
  return sendSuccess(res, { data: { user, profile } });
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);
  return sendSuccess(res, { data: { user }, message: 'Profile updated' });
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user._id, req.body);
  return sendSuccess(res, { message: 'Password updated' });
});
