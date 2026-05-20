import React, { useState, useCallback } from 'react'
import { Plus, Download, Users } from 'lucide-react'
import { Lead, LeadFilters, LeadFormData } from '../types'
import { useLeads } from '../hooks/useLeads'
import { useDebounce } from '../hooks/useDebounce'
import { leadService } from '../services/leadService'
import { LeadFiltersBar } from '../components/leads/LeadFilters'
import { LeadTable } from '../components/leads/LeadTable'
import { LeadDetailModal } from '../components/leads/LeadDetailModal'
import { LeadForm } from '../components/leads/LeadForm'
import { StatsCards } from '../components/leads/StatsCards'
import { Pagination } from '../components/leads/Pagination'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { errMsg } from '../utils/helpers'
import toast from 'react-hot-toast'

export const DashboardPage:React.FC =() =>{
  const [filters, setFilters] = useState<LeadFilters>({ sort: 'latest', page: 1, limit: 10 })
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 400)

  const { leads, meta, isLoading, refetch } = useLeads({ ...filters, search: debouncedSearch || undefined })

  const [viewLead, setViewLead] = useState<Lead | null>(null)
  const [editLead, setEditLead] = useState<Lead | null>(null)
  const [deleteLead, setDeleteLead] = useState<Lead | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)

  const setFilter=useCallback((k:keyof LeadFilters,v: string) =>
    setFilters(p =>({...p,[k]: v||undefined, page: 1})), [])

  const resetFilters=useCallback(()=>{setFilters({sort: 'latest',page:1,limit:10}); setSearchInput('') }, [])

  const handleCreate = async (data:LeadFormData)=>{
    setFormLoading(true)
    try {await leadService.create(data);toast.success('Lead created');setShowCreate(false);refetch() }
    catch (e) {toast.error(errMsg(e))}
    finally {setFormLoading(false)}
  }

  const handleUpdate=async(data:LeadFormData)=>{
    if (!editLead) return
    setFormLoading(true)
    try {await leadService.update(editLead._id,data);toast.success('Lead updated'); setEditLead(null); refetch() }
    catch (e) { toast.error(errMsg(e)) }
    finally { setFormLoading(false) }
  }

  const handleDelete=async()=>{
    if (!deleteLead) return
    setDeleteLoading(true)
    try {await leadService.delete(deleteLead._id); toast.success('Lead deleted'); setDeleteLead(null); refetch()}
    catch (e) {toast.error(errMsg(e))}
    finally {setDeleteLoading(false)}
  }

  const handleExport=async ()=>{
    setExportLoading(true)
    try {await leadService.exportCSV({ status:filters.status, source: filters.source, search: debouncedSearch || undefined }); toast.success('CSV exported') }
    catch (e) { toast.error(errMsg(e)) }
    finally { setExportLoading(false) }
  }

  return (
    <div className="space-y-4 max-w-screen-xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Leads</h2>
          <p className="text-xs text-gray-400 mt-0.5">{meta ? `${meta.total} total` : 'Manage your pipeline'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />} onClick={handleExport} isLoading={exportLoading}>
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
          <Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setShowCreate(true)}>
            <span className="hidden sm:inline">New Lead</span><span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {meta && <StatsCards leads={leads} total={meta.total} />}

      <div className="bg-white dark:bg-surface-card rounded-2xl border border-gray-100 dark:border-surface-border overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-surface-border">
          <LeadFiltersBar filters={filters} searchInput={searchInput} onSearchChange={setSearchInput} onFilterChange={setFilter} onReset={resetFilters} />
        </div>
        {!isLoading && leads.length === 0
          ? <EmptyState icon={<Users className="w-8 h-8" />} title="No leads found" description="Adjust filters or create a new lead." action={<Button size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setShowCreate(true)}>New Lead</Button>} />
          : <LeadTable leads={leads} isLoading={isLoading} onView={setViewLead} onEdit={setEditLead} onDelete={setDeleteLead} />
        }
        {meta && <Pagination meta={meta} onPageChange={p => setFilters(prev => ({ ...prev, page: p }))} />}
      </div>

      <LeadDetailModal lead={viewLead} isOpen={!!viewLead} onClose={() => setViewLead(null)} />
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Lead">
        <LeadForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} isLoading={formLoading} />
      </Modal>
      <Modal isOpen={!!editLead} onClose={() => setEditLead(null)} title="Edit Lead">
        <LeadForm initialData={editLead ? { name: editLead.name, email: editLead.email, status: editLead.status, source: editLead.source, assignedTo: typeof editLead.assignedTo === 'object' && editLead.assignedTo ? (editLead.assignedTo._id ?? editLead.assignedTo.id) : undefined } : undefined} onSubmit={handleUpdate} onCancel={() => setEditLead(null)} isLoading={formLoading} />
      </Modal>
      <ConfirmDialog isOpen={!!deleteLead} onClose={() => setDeleteLead(null)} onConfirm={handleDelete} title="Delete Lead" message={`Delete "${deleteLead?.name}"? This cannot be undone.`} isLoading={deleteLoading} />
    </div>
  )
}
