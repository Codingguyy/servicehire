import React from 'react'
import { Loader2 } from 'lucide-react'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: React.ReactNode
}

const V = {
  primary:   'bg-brand-600 hover:bg-brand-500 text-white shadow-sm shadow-brand-600/30',
  secondary: 'bg-white dark:bg-surface-card border border-gray-200 dark:border-surface-border text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-surface-hover',
  danger:    'bg-red-600 hover:bg-red-500 text-white',
  ghost:     'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-hover hover:text-gray-900 dark:hover:text-white',
}
const S = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-5 py-2.5 text-sm' }

export const Button: React.FC<Props> = ({ variant = 'primary', size = 'md', isLoading, leftIcon, children, className = '', disabled, ...p }) => (
  <button
    className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:opacity-50 disabled:cursor-not-allowed ${V[variant]} ${S[size]} ${className}`}
    disabled={disabled ?? isLoading}
    {...p}
  >
    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : leftIcon ? <span className="flex items-center">{leftIcon}</span> : null}
    {children}
  </button>
)
