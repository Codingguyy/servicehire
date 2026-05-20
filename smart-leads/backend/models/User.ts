import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'
import { UserRole } from '../types'

export interface IUserDoc extends Document {
  name: string
  email: string
  password: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  comparePassword(candidate: string): Promise<boolean>
}

const schema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: { type: String, enum: ['admin', 'sales'], default: 'sales' },
  },
  { timestamps: true }
)

schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

schema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password)
}

export default mongoose.model<IUserDoc>('User', schema)
