import { Response, NextFunction } from 'express'
import Lead from '../models/Lead'
import { AuthRequest, LeadQuery } from '../types'
import { ok, created, fail } from '../utils/response'

// Build the base filter for sales users: they see leads assigned to them OR created by them
function salesFilter(userId: string): Record<string, unknown> {
  return { $or: [{ assignedTo: userId }, { createdBy: userId }] }
}

export const createLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, status, source, assignedTo } = req.body
    const lead = await Lead.create({ name, email, status: status ?? 'New', source, assignedTo: assignedTo || undefined, createdBy: req.user?.id })
    await lead.populate('createdBy', 'name email role')
    await lead.populate('assignedTo', 'name email role')
    created(res, 'Lead created', lead)
  } catch (e) { next(e) }
}

export const getLeads = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, source, search, sort = 'latest', page = '1', limit = '10' } = req.query as LeadQuery

    // Start with role-based filter
    const filter: Record<string, unknown> = {}
    if (req.user?.role === 'sales') {
      // Sales: only see leads assigned to them OR created by them
      filter.$or = [{ assignedTo: req.user.id }, { createdBy: req.user.id }]
    }

    // Apply additional filters — but if we already have $or from sales filter,
    // we need to wrap both into $and to avoid clobbering
    const conditions: Record<string, unknown>[] = []
    if (req.user?.role === 'sales') {
      conditions.push({ $or: [{ assignedTo: req.user.id }, { createdBy: req.user.id }] })
    }
    if (status) conditions.push({ status })
    if (source) conditions.push({ source })
    if (search) conditions.push({ $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] })

    const finalFilter = conditions.length > 0 ? { $and: conditions } : {}

    const pageNum = Math.max(1, parseInt(page, 10))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)))
    const skip = (pageNum - 1) * limitNum
    const sortOrder = sort === 'oldest' ? 1 : -1

    const [leads, total] = await Promise.all([
      Lead.find(finalFilter).populate('createdBy', 'name email role').populate('assignedTo', 'name email role').sort({ createdAt: sortOrder }).skip(skip).limit(limitNum),
      Lead.countDocuments(finalFilter),
    ])
    const totalPages = Math.ceil(total / limitNum)
    ok(res, 'Leads fetched', leads, { total, page: pageNum, limit: limitNum, totalPages, hasNextPage: pageNum < totalPages, hasPrevPage: pageNum > 1 })
  } catch (e) { next(e) }
}

export const getLeadById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email role').populate('assignedTo', 'name email role')
    if (!lead) { fail(res, 404, 'Lead not found'); return }
    // Sales can view if they created it OR it is assigned to them
    if (req.user?.role === 'sales') {
      const isCreator = lead.createdBy._id.toString() === req.user.id
      const isAssigned = lead.assignedTo?._id?.toString() === req.user.id
      if (!isCreator && !isAssigned) { fail(res, 403, 'Permission denied'); return }
    }
    ok(res, 'Lead fetched', lead)
  } catch (e) { next(e) }
}

export const updateLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id)
    if (!lead) { fail(res, 404, 'Lead not found'); return }
    // Sales can update only leads they created OR are assigned to
    if (req.user?.role === 'sales') {
      const isCreator = lead.createdBy.toString() === req.user.id
      const isAssigned = lead.assignedTo?.toString() === req.user.id
      if (!isCreator && !isAssigned) { fail(res, 403, 'Permission denied'); return }
    }
    const { name, email, status, source, assignedTo } = req.body
    const updatePayload: Record<string, unknown> = {}
    if (name !== undefined) updatePayload.name = name
    if (email !== undefined) updatePayload.email = email
    if (status !== undefined) updatePayload.status = status
    if (source !== undefined) updatePayload.source = source
    // Allow clearing assignedTo by sending null/empty string, or setting a new one
    if (assignedTo !== undefined) {
      updatePayload.assignedTo = assignedTo && assignedTo !== '' ? assignedTo : null
    }

    const updated = await Lead.findByIdAndUpdate(req.params.id, updatePayload, { new: true, runValidators: true })
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
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

    const conditions: Record<string, unknown>[] = []
    if (req.user?.role === 'sales') {
      conditions.push({ $or: [{ assignedTo: req.user.id }, { createdBy: req.user.id }] })
    }
    if (status) conditions.push({ status })
    if (source) conditions.push({ source })
    if (search) conditions.push({ $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] })

    const finalFilter = conditions.length > 0 ? { $and: conditions } : {}

    const leads = await Lead.find(finalFilter).populate('assignedTo', 'name').sort({ createdAt: -1 })
    const rows = [
      ['ID', 'Name', 'Email', 'Status', 'Source', 'Assigned To', 'Created At'],
      ...leads.map(l => [
        l._id.toString(), l.name, l.email, l.status, l.source,
        (l.assignedTo as any)?.name ?? 'Unassigned',
        new Date(l.createdAt).toISOString()
      ])
    ]
    const csv = rows.map(r => r.map(f => `"${String(f).replace(/"/g, '""')}"`).join(',')).join('\n')

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv')
    res.send(csv)
  } catch (e) { next(e) }
}
