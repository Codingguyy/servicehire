import { useState, useEffect, useCallback } from 'react'
import { Lead, LeadFilters, PaginationMeta } from '../types'
import { leadService } from '../services/leadService'
import toast from 'react-hot-toast'
import { errMsg } from '../utils/helpers'

interface UseLeadsReturn {
  leads: Lead[]
  meta: PaginationMeta | null
  isLoading: boolean
  refetch: () => void
}

export function useLeads(filters:LeadFilters):UseLeadsReturn {
  const [leads, setLeads]=useState<Lead[]>([])
  const [meta, setMeta]=useState<PaginationMeta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tick, setTick] = useState(0)

  const refetch=useCallback(()=>setTick(t=>t+1),[])

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    leadService.getLeads(filters)
      .then(r => {
        if (cancelled) return
        if (r.success) { setLeads(r.data ?? []); setMeta(r.meta ?? null) }
        else toast.error(r.message ?? 'Failed to fetch leads')
      })
      .catch(e => {if (!cancelled) toast.error(errMsg(e))})
      .finally(() => {if (!cancelled) setIsLoading(false)})
    return () => {cancelled = true}
  }, [filters.status, filters.source, filters.search, filters.sort, filters.page, filters.limit, tick])

  return { leads, meta, isLoading, refetch }
}
