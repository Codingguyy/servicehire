import React from 'react'
import { Lead } from '../../types'
import { Users, TrendingUp, Phone, CheckCircle2, XCircle } from 'lucide-react'

const STATS = [
  {key: null,label: 'Total', icon: Users,         cls: 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-600/10' },
  { key: 'New',  label: 'New',icon: TrendingUp,    cls: 'text-blue-500 bg-blue-500/10'},
  { key:'Contacted', label:'Contacted',icon: Phone,         cls: 'text-amber-500 bg-amber-500/10'},
  {key:'Qualified',label:'Qualified',icon:CheckCircle2,  cls: 'text-emerald-500 bg-emerald-500/10'},
  {key:'Lost',   label: 'Lost',      icon: XCircle,       cls: 'text-red-500 bg-red-500/10'},
]

export const StatsCards:React.FC<{leads:Lead[];total:number}> =({leads,total})=>{
  const counts=leads.reduce((acc, l)=>({...acc,[l.status]: (acc[l.status] ?? 0) + 1 }), {} as Record<string,number>)
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {STATS.map(({ key, label, icon: Icon, cls }) => (
        <div key={label} className="bg-white dark:bg-surface-card rounded-xl border border-gray-100 dark:border-surface-border p-3.5 flex items-center gap-3">
          <div className={`p-2 rounded-lg ${cls}`}><Icon className="w-4 h-4" /></div>
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-white leading-none">{key ? (counts[key] ?? 0) : total}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
