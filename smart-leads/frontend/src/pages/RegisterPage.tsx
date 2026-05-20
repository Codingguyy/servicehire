import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Button } from '../components/ui/Button'
import { errMsg } from '../utils/helpers'
import toast from 'react-hot-toast'

type F ={name?:string;email?:string;password?:string;confirm?:string}

export const RegisterPage:React.FC=()=>{
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState('sales')
  const [errors, setErrors] = useState<F>({})
  const [loading, setLoading] = useState(false)

  const validate=()=>{
    const e: F = {}
    if (!name.trim()) e.name='Required'
    else if (name.length < 2) e.name='Min 2 characters'
    if (!email) e.email='Required'
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email='Invalid email'
    if (!password) e.password = 'Required'
    else if (password.length < 6) e.password='Min 6 characters'
    if (password !== confirm) e.confirm='Passwords do not match'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit =async(e:React.FormEvent)=>{
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try { await register(name, email, password, role); toast.success('Account created!'); navigate('/dashboard') }
    catch (err) { toast.error(errMsg(err)) }
    finally { setLoading(false) }
  }

  const clr=(k:keyof F)=>setErrors(p =>({...p,[k]: undefined}))

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-surface p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="flex flex-col items-center mb-7">
          <div className="w-11 h-11 rounded-2xl bg-brand-600 flex items-center justify-center mb-3 shadow-lg shadow-brand-600/25">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create account</h1>
          <p className="text-sm text-gray-400 mt-0.5">Join SmartLeads today</p>
        </div>
        <div className="bg-white dark:bg-surface-card rounded-2xl border border-gray-100 dark:border-surface-border p-7 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" placeholder="Your name" value={name} onChange={e => { setName(e.target.value); clr('name') }} error={errors.name} leftIcon={<User className="w-4 h-4" />} autoFocus />
            <Input label="Email" type="email" placeholder="you@example.com" value={email} onChange={e => { setEmail(e.target.value); clr('email') }} error={errors.email} leftIcon={<Mail className="w-4 h-4" />} />
            <Input label="Password" type="password" placeholder="Min 6 characters" value={password} onChange={e => { setPassword(e.target.value); clr('password') }} error={errors.password} leftIcon={<Lock className="w-4 h-4" />} />
            <Input label="Confirm Password" type="password" placeholder="Repeat password" value={confirm} onChange={e => { setConfirm(e.target.value); clr('confirm') }} error={errors.confirm} leftIcon={<Lock className="w-4 h-4" />} />
            <Select label="Role" value={role} onChange={e => setRole(e.target.value)} options={[{ value: 'sales', label: 'Sales User' }, { value: 'admin', label: 'Admin' }]} />
            <Button type="submit" className="w-full" size="lg" isLoading={loading}>Create Account</Button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-5">
            Have an account? <Link to="/login" className="text-brand-600 dark:text-brand-400 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
