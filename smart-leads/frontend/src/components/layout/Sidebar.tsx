import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, LogOut, Zap } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface Props { isOpen: boolean; onClose: () => void }

export const Sidebar: React.FC<Props> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()

  const nav = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ...(user?.role === 'admin' ? [{ to: '/users', icon: Users, label: 'Users' }] : []),
  ]

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-60 z-30 flex flex-col bg-white dark:bg-surface-card border-r border-gray-100 dark:border-surface-border transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 dark:border-surface-border">
          <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900 dark:text-white">SmartLeads</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} onClick={onClose}
              className={({ isActive }) => `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-brand-50 dark:bg-brand-600/10 text-brand-600 dark:text-brand-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-surface-hover hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />{label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-4 border-t border-gray-100 dark:border-surface-border pt-3">
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" />Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
