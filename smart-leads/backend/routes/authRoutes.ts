import { Router } from 'express'
import { body } from 'express-validator'
import { register, login, getMe, getUsers } from '../controllers/authController'
import { authenticate, authorize } from '../middleware/auth'
import { validate } from '../middleware/validate'

const router = Router()

router.post('/register', validate([
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'sales']).withMessage('Role must be admin or sales'),
]), register)

router.post('/login', validate([
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
]), login)

router.get('/me', authenticate, getMe)
router.get('/users', authenticate, authorize('admin'), getUsers)

export default router
