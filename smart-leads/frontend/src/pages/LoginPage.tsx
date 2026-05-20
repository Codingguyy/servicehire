import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { errMsg } from '../utils/helpers'
import toast from 'react-hot-toast'

export const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e: typeof errors = {}
    if (!email) e.email = 'Required'
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Invalid email'
    if (!password) e.password = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit =async (e:React.FormEvent)=>{
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try { await login(email, password); toast.success('Welcome back!'); navigate('/dashboard') }
    catch (err) { toast.error(errMsg(err)) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-surface p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="flex flex-col items-center mb-7">
          <div className="w-11 h-11 rounded-2xl bg-brand-600 flex items-center justify-center mb-3 shadow-lg shadow-brand-600/25">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sign in</h1>
          <p className="text-sm text-gray-400 mt-0.5">to your SmartLeads account</p>
        </div>
        <div className="bg-white dark:bg-surface-card rounded-2xl border border-gray-100 dark:border-surface-border p-7 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })) }} error={errors.email} leftIcon={<Mail className="w-4 h-4" />} autoFocus autoComplete="email" />
            <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })) }} error={errors.password} leftIcon={<Lock className="w-4 h-4" />} autoComplete="current-password" />
            <Button type="submit" className="w-full" size="lg" isLoading={loading}>Sign In</Button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-5">
            No account? <Link to="/register" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
