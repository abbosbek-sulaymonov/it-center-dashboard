import { Router } from 'express';

import authRoutes from './auth.routes.js';
import bookRoutes from './book.routes.js';
import courseRoutes from './course.routes.js';
import enrollmentRoutes from './enrollment.routes.js';
import statsRoutes from './stats.routes.js';
import studentRoutes from './student.routes.js';
import tutorRoutes from './tutor.routes.js';

const router = Router();

/** Discovery document, handy when poking the API by hand. */
router.get('/', (_req, res) => {
  res.json({
    success: true,
    data: {
      name: 'IT Center API',
      version: 'v1',
      resources: ['auth', 'courses', 'books', 'tutors', 'students', 'enrollments', 'stats'],
    },
  });
});

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/books', bookRoutes);
router.use('/tutors', tutorRoutes);
router.use('/students', studentRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/stats', statsRoutes);

export default router;
