// server/routes/employee/book.routes.js
import { Router } from 'express';
const router = Router();
import { authenticateToken, requireAdmin } from '@server/middleware/auth';
import { getBookById, getBooks, searchBooks } from '@server/controllers/employee/book';

// Public routes
router.get('/', getBooks);
router.get('/search', searchBooks);
router.get('/:id', getBookById);

// Admin routes
router.post('/', authenticateToken, requireAdmin, createBook);
router.put('/:id', authenticateToken, requireAdmin, updateBook);
router.delete('/:id', authenticateToken, requireAdmin, deleteBook);

export default router;
