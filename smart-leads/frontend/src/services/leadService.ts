import http from './api'
import { ApiResponse, Lead, LeadFilters, LeadFormData } from '../types'

export const leadService = {
  getLeads:(filters:LeadFilters={})=>{
    const p = new URLSearchParams()
    if (filters.status)p.append('status',filters.status)
    if (filters.source)p.append('source',filters.source)
    if (filters.search)p.append('search',filters.search)
    if (filters.sort)p.append('sort',filters.sort)
    if (filters.page)p.append('page',String(filters.page))
    if (filters.limit)p.append('limit',String(filters.limit))
    return http.get<ApiResponse<Lead[]>>(`/leads?${p}`)
  },
  getById:(id:string)=>
    http.get<ApiResponse<Lead>>(`/leads/${id}`),
  create:(data:LeadFormData)=>
    http.post<ApiResponse<Lead>>('/leads', data),
  update:(id:string,data:Partial<LeadFormData>) =>
    http.put<ApiResponse<Lead>>(`/leads/${id}`, data),
  delete:(id:string)=>
    http.delete<ApiResponse>(`/leads/${id}`),
  exportCSV: async (filters: Omit<LeadFilters, 'page' | 'limit'>={})=>{
    const p=new URLSearchParams()
    if (filters.status) p.append('status',filters.status)
    if (filters.source) p.append('source',filters.source)
    if (filters.search) p.append('search',filters.search)
    const blob = await http.getBlob(`/leads/export?${p}`)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download=`leads-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  },
}
