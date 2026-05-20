import React from 'react'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { Lead } from '../../types'
import { StatusBadge, SourceBadge } from '../ui/Badge'
import { LeadRowSkeleton } from '../ui/Skeleton'
import { formatDate, initials } from '../../utils/helpers'
import { useAuth } from '../../context/AuthContext'

interface Props {
  leads: Lead[]
  isLoading: boolean
  onView: (l: Lead) => void
  onEdit: (l: Lead) => void
  onDelete: (l: Lead) => void
}

export const LeadTable:React.FC<Props>=({leads, isLoading, onView, onEdit, onDelete})=>{
  const { user } = useAuth()
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-surface-border">
            {['Lead', 'Status', 'Source', 'Created', 'Actions'].map((h, i) => (
              <th key={h} className={`px-4 py-3 text-left text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider ${i === 3 ? 'hidden md:table-cell' : ''} ${i === 4 ? 'text-right' : ''}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-surface-border">
          {isLoading
            ? Array.from({length: 5}).map((_, i) => <LeadRowSkeleton key={i} />)
            : leads.map(lead => (
              <tr key={lead._id} className="group hover:bg-gray-50 dark:hover:bg-surface-hover transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-600/20 text-brand-600 dark:text-brand-400 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {initials(lead.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{lead.name}</p>
                      <p className="text-xs text-gray-400 truncate">{lead.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                <td className="px-4 py-3"><SourceBadge source={lead.source} /></td>
                <td className="px-4 py-3 text-xs text-gray-400 hidden md:table-cell">{formatDate(lead.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onView(lead)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-600/10 transition-colors" title="View"><Eye className="w-3.5 h-3.5" /></button>
                    <button onClick={() => onEdit(lead)} className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                    {user?.role === 'admin' && (
                      <button onClick={() => onDelete(lead)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}
