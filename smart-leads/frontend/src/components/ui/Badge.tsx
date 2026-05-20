import React from 'react'
import { LeadStatus, LeadSource } from '../../types'
import { STATUS_COLORS, SOURCE_COLORS } from '../../utils/helpers'

export const StatusBadge: React.FC<{ status: LeadStatus }> = ({ status }) => {
  const c = STATUS_COLORS[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  )
}

export const SourceBadge: React.FC<{ source: LeadSource }> = ({ source }) => {
  const c = SOURCE_COLORS[source]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {source}
    </span>
  )
}
