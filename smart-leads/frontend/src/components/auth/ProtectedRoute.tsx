import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { UserRole } from '../../types'
import { Loader2 } from 'lucide-react'

export const ProtectedRoute: React.FC<{allowedRoles?: UserRole[] }> =({allowedRoles}) => {
  const {isAuthenticated, isLoading, user} = useAuth()

  if (isLoading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-surface">
      <Loader2 className="w-7 h-7 text-brand-600 animate-spin" />
    </div>
  )

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
