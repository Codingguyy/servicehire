import React from 'react'

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-surface-hover rounded ${className}`} />
)

export const LeadRowSkeleton: React.FC = () => (
  <tr className="border-b border-gray-50 dark:border-surface-border">
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
        <div className="space-y-1.5"><Skeleton className="w-28 h-3" /><Skeleton className="w-36 h-2.5" /></div>
      </div>
    </td>
    <td className="px-4 py-3"><Skeleton className="w-20 h-5 rounded-full" /></td>
    <td className="px-4 py-3"><Skeleton className="w-20 h-5 rounded-full" /></td>
    <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="w-24 h-3" /></td>
    <td className="px-4 py-3"><Skeleton className="w-16 h-3 ml-auto" /></td>
  </tr>
)
