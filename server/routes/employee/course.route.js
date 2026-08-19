// server/routes/employee/course.routes.js
import { Router } from 'express';
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  searchCourses,
  updateCourse,
} from '@server/controllers/employee';
import { authenticateToken, requireAdmin } from '@server/middleware/auth';

const router = Router();

// Public routes
router.get('/', getCourses);
router.get('/search', searchCourses);
router.get('/:id', getCourseById);

// Admin routes
router.post('/', authenticateToken, requireAdmin, createCourse);
router.put('/:id', authenticateToken, requireAdmin, updateCourse);
router.delete('/:id', authenticateToken, requireAdmin, deleteCourse);

export default router;
