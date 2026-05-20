import React from 'react'
import { ChevronDown } from 'lucide-react'

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export const Select: React.FC<Props> = ({ label, error, options, placeholder, className = '', id, ...p }) => {
  const uid = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={uid} className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <div className="relative">
        <select
          id={uid}
          className={`w-full appearance-none rounded-lg border px-3 py-2.5 pr-8 text-sm bg-white dark:bg-surface-card border-gray-200 dark:border-surface-border text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all disabled:opacity-50 ${error ? 'border-red-400' : ''} ${className}`}
          {...p}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
