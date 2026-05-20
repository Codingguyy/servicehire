import { Router } from 'express'
import { body, param } from 'express-validator'
import { createLead, getLeads, getLeadById, updateLead, deleteLead, exportCSV } from '../controllers/leadController'
import { authenticate, authorize } from '../middleware/auth'
import { validate } from '../middleware/validate'

const router = Router()

router.use(authenticate)

const idParam = validate([param('id').isMongoId().withMessage('Invalid ID')])

router.get('/export', exportCSV)
router.get('/', getLeads)
router.post('/', validate([
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']),
  body('source').notEmpty().withMessage('Source is required').isIn(['Website', 'Instagram', 'Referral']),
  body('assignedTo').optional().isMongoId(),
]), createLead)
router.get('/:id', idParam, getLeadById)
router.put('/:id', idParam, validate([
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('email').optional().trim().isEmail().withMessage('Invalid email'),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']),
  body('source').optional().isIn(['Website', 'Instagram', 'Referral']),
  body('assignedTo').optional().isMongoId(),
]), updateLead)
router.delete('/:id', idParam, authorize('admin'), deleteLead)
export default router
