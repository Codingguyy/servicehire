import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

const TITLES: Record<string, string> = { '/dashboard': 'Dashboard', '/users': 'Users' }

export const AppLayout: React.FC = () => {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-surface overflow-hidden">
      <Sidebar isOpen={open} onClose={() => setOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header onMenuToggle={() => setOpen(p => !p)} title={TITLES[loc.pathname] ?? 'Smart Leads'} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
