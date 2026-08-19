import { Router } from 'express';

import * as statsController from '../controllers/stats.controller.js';
import { requireAdmin, requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/overview', requireAuth, requireAdmin, statsController.adminOverview);

export default router;
