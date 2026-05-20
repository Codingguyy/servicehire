import mongoose from 'mongoose'

const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not defined in .env')

  mongoose.connection.on('connected', () => console.log('✅ MongoDB connected'))
  mongoose.connection.on('error', (err) => console.error('MongoDB error:', err))
  mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'))

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  })
}

export default connectDB
