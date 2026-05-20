export type UserRole = 'admin' | 'sales'
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost'
export type LeadSource = 'Website' | 'Instagram' | 'Referral'
export type SortOrder = 'latest' | 'oldest'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt?: string
}

export interface Lead {
  _id: string
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
  assignedTo?: User | null
  createdBy: User
  createdAt: string
  updatedAt: string
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  meta?: PaginationMeta
  errors?: string[]
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LeadFilters {
  status?: LeadStatus | ''
  source?: LeadSource | ''
  search?: string
  sort?: SortOrder
  page?: number
  limit?: number
}

export interface LeadFormData {
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
  assignedTo?: string
}
