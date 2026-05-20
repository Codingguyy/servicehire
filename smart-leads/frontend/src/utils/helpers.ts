import { LeadStatus, LeadSource } from '../types'

export const STATUS_COLORS: Record<LeadStatus, { bg: string; text: string; dot: string }> = {
  New:       { bg: 'bg-blue-500/10',    text: 'text-blue-500',    dot: 'bg-blue-500' },
  Contacted: { bg: 'bg-amber-500/10',   text: 'text-amber-500',   dot: 'bg-amber-500' },
  Qualified: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', dot: 'bg-emerald-500' },
  Lost:      { bg: 'bg-red-500/10',     text: 'text-red-500',     dot: 'bg-red-500' },
}

export const SOURCE_COLORS: Record<LeadSource, { bg: string; text: string }> = {
  Website:   { bg: 'bg-violet-500/10', text: 'text-violet-500' },
  Instagram: { bg: 'bg-pink-500/10',   text: 'text-pink-500' },
  Referral:  { bg: 'bg-cyan-500/10',   text: 'text-cyan-500' },
}

export const formatDate = (d: string) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d))

export const formatDateTime = (d: string) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d))

export const initials = (name: string) =>
  name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)

export const errMsg = (err: unknown): string => {
  if (err && typeof err === 'object') {
    // API response object with success:false
    if ('message' in err && typeof (err as { message: unknown }).message === 'string') {
      const e = err as { message: string; errors?: string[] }
      if (e.errors?.length) return e.errors[0]
      return e.message
    }
  }
  if (err instanceof Error) return err.message
  return 'Something went wrong'
}
