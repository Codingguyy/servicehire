import React, { useEffect, useState } from 'react'
import { ShieldCheck, User, Users } from 'lucide-react'
import { User as IUser } from '../types'
import { authService } from '../services/authService'
import { Skeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { formatDate, initials } from '../utils/helpers'
import toast from 'react-hot-toast'
import { errMsg } from '../utils/helpers'

export const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    authService.getUsers()
      .then(r=>{if (r.data)setUsers(r.data)})
      .catch(e =>toast.error(errMsg(e)))
      .finally(()=>setLoading(false))
  }, [])

  return (
    <div className="space-y-4 max-w-screen-xl mx-auto">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Users</h2>
        <p className="text-xs text-gray-400 mt-0.5">{users.length} registered users</p>
      </div>
      <div className="bg-white dark:bg-surface-card rounded-2xl border border-gray-100 dark:border-surface-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-surface-border">
              {['User', 'Role', 'Joined'].map((h, i) => (
                <th key={h} className={`px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider ${i === 2 ? 'hidden md:table-cell' : ''}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-surface-border">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><Skeleton className="w-8 h-8 rounded-full" /><div className="space-y-1.5"><Skeleton className="w-32 h-3" /><Skeleton className="w-40 h-2.5" /></div></div></td>
                  <td className="px-4 py-3"><Skeleton className="w-16 h-5 rounded-full" /></td>
                  <td className="px-4 py-3 hidden md:table-cell"><Skeleton className="w-24 h-3" /></td>
                </tr>
              ))
              : users.length === 0
                ? <tr><td colSpan={3}><EmptyState icon={<Users className="w-7 h-7" />} title="No users yet" /></td></tr>
                : users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-surface-hover transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-600/20 text-brand-600 dark:text-brand-400 text-xs font-bold flex items-center justify-center flex-shrink-0">{initials(u.name)}</div>
                        <div className="min-w-0"><p className="font-medium text-gray-900 dark:text-white truncate">{u.name}</p><p className="text-xs text-gray-400 truncate">{u.email}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-brand-50 dark:bg-brand-600/10 text-brand-600 dark:text-brand-400' : 'bg-gray-100 dark:bg-surface-hover text-gray-500 dark:text-gray-400'}`}>
                        {u.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {u.role === 'admin' ? 'Admin' : 'Sales'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 hidden md:table-cell">{u.createdAt ? formatDate(u.createdAt) : '—'}</td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
