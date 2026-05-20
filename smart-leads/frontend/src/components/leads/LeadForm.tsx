import React, { useState, useEffect } from 'react'
import { LeadFormData, User } from '../../types'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { authService } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'

interface Props {
  initialData?: Partial<LeadFormData>
  onSubmit: (data: LeadFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

const STATUS_OPTS = [{value: 'New', label: 'New'}, {value: 'Contacted', label: 'Contacted'}, {value:'Qualified',label: 'Qualified' }, {value:'Lost',label:'Lost'}]
const SOURCE_OPTS = [{value:'Website',label:'Website'}, { value:'Instagram',label:'Instagram'}, {value:'Referral', label: 'Referral' }]

export const LeadForm: React.FC<Props> =({initialData, onSubmit, onCancel, isLoading}) =>{
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [form, setForm] = useState<LeadFormData>({
    name: initialData?.name ?? '',
    email: initialData?.email ?? '',
    status: initialData?.status ?? 'New',
    source: initialData?.source ?? 'Website',
    assignedTo: initialData?.assignedTo ?? '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({})

  useEffect(() => {
    if (user?.role === 'admin') authService.getUsers().then(r => { if (r.data) setUsers(r.data) }).catch(() => null)
  }, [user])

  const set = (k: keyof LeadFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(p => ({ ...p, [k]: e.target.value }))
    setErrors(p => ({ ...p, [k]: undefined }))
  }

  const validate = ()=>{
    const e: Partial<Record<keyof LeadFormData, string>> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    else if (form.name.length < 2) e.name = 'Min 2 characters'
    if (!form.email) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.source) e.source = 'Source is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit=async (e: React.FormEvent) =>{
    e.preventDefault()
    if (!validate()) return
    await onSubmit({ ...form, assignedTo: form.assignedTo || undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Full Name" placeholder="e.g. Rahul Sharma" value={form.name} onChange={set('name')} error={errors.name} autoFocus />
      <Input label="Email" type="email" placeholder="e.g. rahul@example.com" value={form.email} onChange={set('email')} error={errors.email} />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Status" value={form.status} onChange={set('status')} options={STATUS_OPTS} />
        <Select label="Source" value={form.source} onChange={set('source')} options={SOURCE_OPTS} error={errors.source} />
      </div>
      {user?.role === 'admin' && users.length > 0 && (
        <Select label="Assign To" value={form.assignedTo ?? ''} onChange={set('assignedTo')} options={users.map(u => ({ value: u._id ?? u.id, label: `${u.name} (${u.role})` }))} placeholder="— Unassigned —" />
      )}
      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel} disabled={isLoading}>Cancel</Button>
        <Button type="submit" size="sm" isLoading={isLoading}>{initialData?.name ? 'Save Changes' : 'Create Lead'}</Button>
      </div>
    </form>
  )
}
