import { Response, NextFunction } from 'express'
import Lead from '../models/Lead'
import { AuthRequest, LeadQuery } from '../types'
import { ok, created, fail } from '../utils/response'

export const createLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, status, source, assignedTo } = req.body
    const lead = await Lead.create({ name, email, status: status ?? 'New', source, assignedTo: assignedTo || undefined, createdBy: req.user?.id })
    await lead.populate('createdBy', 'name email')
    created(res, 'Lead created', lead)
  } catch (e) { next(e) }
}

export const getLeads = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, source, search, sort = 'latest', page = '1', limit = '10' } = req.query as LeadQuery
    const filter: Record<string, unknown> = {}
    if (req.user?.role === 'sales') filter.createdBy = req.user.id
    if (status) filter.status = status
    if (source) filter.source = source
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }]

    const pageNum = Math.max(1, parseInt(page, 10))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)))
    const skip = (pageNum - 1) * limitNum
    const sortOrder = sort === 'oldest' ? 1 : -1

    const [leads, total] = await Promise.all([
      Lead.find(filter).populate('createdBy', 'name email').populate('assignedTo', 'name email').sort({ createdAt: sortOrder }).skip(skip).limit(limitNum),
      Lead.countDocuments(filter),
    ])
    const totalPages = Math.ceil(total / limitNum)
    ok(res, 'Leads fetched', leads, { total, page: pageNum, limit: limitNum, totalPages, hasNextPage: pageNum < totalPages, hasPrevPage: pageNum > 1 })
  } catch (e) { next(e) }
}

export const getLeadById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email').populate('assignedTo', 'name email')
    if (!lead) { fail(res, 404, 'Lead not found'); return }
    if (req.user?.role === 'sales' && lead.createdBy._id.toString() !== req.user.id) { fail(res, 403, 'Permission denied'); return }
    ok(res, 'Lead fetched', lead)
  } catch (e) { next(e) }
}

export const updateLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)
    if (!lead) { fail(res, 404, 'Lead not found'); return }
    if (req.user?.role === 'sales' && lead.createdBy.toString() !== req.user.id) { fail(res, 403, 'Permission denied'); return }
    const updated = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('createdBy', 'name email').populate('assignedTo', 'name email')
    ok(res, 'Lead updated', updated)
  } catch (e) { next(e) }
}

export const deleteLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)
    if (!lead) { fail(res, 404, 'Lead not found'); return }
    await Lead.findByIdAndDelete(req.params.id)
    ok(res, 'Lead deleted')
  } catch (e) { next(e) }
}

export const exportCSV = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, source, search } = req.query as LeadQuery
    const filter: Record<string, unknown> = {}
    if (req.user?.role === 'sales') filter.createdBy = req.user.id
    if (status) filter.status = status
    if (source) filter.source = source
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }]

    const leads = await Lead.find(filter).sort({ createdAt: -1 })
    const rows = [['ID', 'Name', 'Email', 'Status', 'Source', 'Created At'],
      ...leads.map(l => [l._id.toString(), l.name, l.email, l.status, l.source, new Date(l.createdAt).toISOString()])]
    const csv = rows.map(r => r.map(f => `"${String(f).replace(/"/g, '""')}"`).join(',')).join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv')
    res.send(csv)
  } catch (e) { next(e) }
}
