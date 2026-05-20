import React from 'react'
import { Search, X } from 'lucide-react'
import { LeadFilters } from '../../types'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'

interface Props {
  filters: LeadFilters
  searchInput: string
  onSearchChange: (v: string) => void
  onFilterChange: (k: keyof LeadFilters, v: string) => void
  onReset: () => void
}

const STATUS_OPTS = [{value: '',label: 'All Statuses' }, { value: 'New', label: 'New' }, { value: 'Contacted', label: 'Contacted' }, { value: 'Qualified',label: 'Qualified' }, { value: 'Lost', label: 'Lost' }]
const SOURCE_OPTS = [{value:'',label: 'All Sources' }, { value: 'Website', label: 'Website' }, { value: 'Instagram', label: 'Instagram' }, {value: 'Referral', label: 'Referral' }]
const SORT_OPTS = [{value: 'latest', label: 'Latest First' }, { value: 'oldest', label: 'Oldest First' }]

export const LeadFiltersBar: React.FC<Props> = ({filters, searchInput, onSearchChange, onFilterChange, onReset}) => {
  const hasActive =!!(filters.status || filters.source || filters.search || filters.sort === 'oldest')
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:items-end">
      <div className="flex-1 min-w-[180px]">
        <Input placeholder="Search name or email…" value={searchInput} onChange={e => onSearchChange(e.target.value)} leftIcon={<Search className="w-3.5 h-3.5" />} />
      </div>
      <Select value={filters.status ?? ''} onChange={e => onFilterChange('status', e.target.value)} options={STATUS_OPTS} className="w-36" />
      <Select value={filters.source ?? ''} onChange={e => onFilterChange('source', e.target.value)} options={SOURCE_OPTS} className="w-32" />
      <Select value={filters.sort ?? 'latest'} onChange={e => onFilterChange('sort', e.target.value)} options={SORT_OPTS} className="w-32" />
      {hasActive && <Button variant="ghost" size="sm" onClick={onReset} leftIcon={<X className="w-3.5 h-3.5" />}>Reset</Button>}
    </div>
  )
}
