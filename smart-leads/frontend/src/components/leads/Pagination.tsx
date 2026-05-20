import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PaginationMeta } from '../../types'

interface Props {meta:PaginationMeta;onPageChange:(p:number) => void }

export const Pagination:React.FC<Props>=({meta, onPageChange}) => {
  const {page, totalPages, total, limit}=meta
  if (totalPages <= 1) return null

  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  const pages: (number | '...')[] = totalPages <= 7
    ? Array.from({ length: totalPages }, (_, i) => i + 1)
    : (() => {
        const arr: (number | '...')[] = [1]
        if (page > 3) arr.push('...')
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) arr.push(i)
        if (page < totalPages - 2) arr.push('...')
        arr.push(totalPages)
        return arr
      })()

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-3 border-t border-gray-100 dark:border-surface-border">
      <p className="text-xs text-gray-400">Showing <span className="text-gray-900 dark:text-white font-medium">{start}–{end}</span> of <span className="text-gray-900 dark:text-white font-medium">{total}</span></p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-hover disabled:opacity-30 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((p, i) => p === '...'
          ? <span key={i} className="px-1 text-gray-400 text-sm">…</span>
          :<button key={p} onClick={() => onPageChange(p as number)} className={`min-w-[28px] h-7 rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-brand-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-hover'}`}>{p}</button>
        )}
        <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-hover disabled:opacity-30 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
