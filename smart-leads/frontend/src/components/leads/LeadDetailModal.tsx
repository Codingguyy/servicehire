import React from 'react'
import { Mail, Calendar, User, Tag, Globe } from 'lucide-react'
import { Lead } from '../../types'
import { Modal } from '../ui/Modal'
import { StatusBadge, SourceBadge } from '../ui/Badge'
import { formatDateTime, initials } from '../../utils/helpers'

const Row: React.FC<{icon: React.ReactNode;label:string; value:React.ReactNode}> =({icon, label, value}) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 dark:border-surface-border last:border-0">
    <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-surface-hover text-gray-400 mt-0.5">{icon}</div>
    <div><p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{label}</p><div className="text-sm font-medium text-gray-900 dark:text-white">{value}</div></div>
  </div>
)

export const LeadDetailModal:React.FC<{lead:Lead|null; isOpen:boolean;onClose:()=>void}>=({lead, isOpen, onClose}) => {
  if (!lead) return null
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Details">
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-surface-border">
        <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-600/20 text-brand-600 dark:text-brand-400 text-lg font-bold flex items-center justify-center flex-shrink-0">
          {initials(lead.name)}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{lead.name}</h3>
          <p className="text-sm text-gray-400">{lead.email}</p>
          <div className="flex gap-2 mt-1.5"><StatusBadge status={lead.status} /><SourceBadge source={lead.source} /></div>
        </div>
      </div>
      <Row icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={<a href={`mailto:${lead.email}`} className="text-brand-600 dark:text-brand-400 hover:underline">{lead.email}</a>} />
      <Row icon={<Tag className="w-3.5 h-3.5" />} label="Status" value={<StatusBadge status={lead.status} />} />
      <Row icon={<Globe className="w-3.5 h-3.5" />} label="Source" value={<SourceBadge source={lead.source} />} />
      <Row icon={<User className="w-3.5 h-3.5" />} label="Created By" value={typeof lead.createdBy === 'object' ? `${lead.createdBy.name} (${lead.createdBy.email})` :String(lead.createdBy)} />
      {lead.assignedTo && typeof lead.assignedTo === 'object' && (
        <Row icon={<User className="w-3.5 h-3.5" />} label="Assigned To" value={`${lead.assignedTo.name} (${lead.assignedTo.email})`} />
      )}
      <Row icon={<Calendar className="w-3.5 h-3.5" />} label="Created At" value={formatDateTime(lead.createdAt)} />
      <Row icon={<Calendar className="w-3.5 h-3.5" />} label="Updated At" value={formatDateTime(lead.updatedAt)} />
    </Modal>
  )
}
