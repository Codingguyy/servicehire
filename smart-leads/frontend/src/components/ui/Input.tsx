import React from 'react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
}

export const Input: React.FC<Props> = ({ label, error, leftIcon, className = '', id, ...p }) => {
  const uid = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={uid} className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <div className="relative">
        {leftIcon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">{leftIcon}</div>}
        <input
          id={uid}
          className={`w-full rounded-lg border px-3 py-2.5 text-sm bg-white dark:bg-surface-card border-gray-200 dark:border-surface-border text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all disabled:opacity-50 ${leftIcon ? 'pl-9' : ''} ${error ? 'border-red-400 focus:ring-red-400/40' : ''} ${className}`}
          {...p}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
