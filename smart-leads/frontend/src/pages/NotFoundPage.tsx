import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export const NotFoundPage:React.FC=() =>(
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-surface">
    <div className="text-center">
      <p className="text-8xl font-black text-gray-200 dark:text-surface-border">404</p>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Page not found</h1>
      <p className="text-sm text-gray-400 mt-1 mb-5">This page doesn't exist.</p>
      <Link to="/dashboard"><Button>Back to Dashboard</Button></Link>
    </div>
  </div>
)
