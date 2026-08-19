import { asyncHandler } from '../middleware/asyncHandler.js';
import * as statsService from '../services/stats.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const adminOverview = asyncHandler(async (_req, res) => {
  return sendSuccess(res, { data: await statsService.getAdminStats() });
});
