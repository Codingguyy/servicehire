import mongoose, { Document, Schema } from 'mongoose'
import { LeadStatus, LeadSource } from '../types'

export interface ILeadDoc extends Document {
  name: string
  email: string
  status: LeadStatus
  source: LeadSource
  assignedTo?: mongoose.Types.ObjectId
  createdBy: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const schema = new Schema<ILeadDoc>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true },
    status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Lost'], default: 'New' },
    source: { type: String, enum: ['Website', 'Instagram', 'Referral'], required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

schema.index({ name: 'text', email: 'text' })
schema.index({ status: 1 })
schema.index({ source: 1 })
schema.index({ createdAt: -1 })

export default mongoose.model<ILeadDoc>('Lead', schema)
