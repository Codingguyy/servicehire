import React from 'react'

interface Props {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState: React.FC<Props> = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
    {icon && <div className="mb-3 p-4 rounded-2xl bg-gray-100 dark:bg-surface-hover text-gray-400 dark:text-gray-500">{icon}</div>}
    <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
    {description && <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 max-w-xs">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
)
