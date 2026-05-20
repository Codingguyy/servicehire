import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import connectDB from './config/database'
import authRoutes from './routes/authRoutes'
import leadRoutes from './routes/leadRoutes'
import {errorHandler,notFound} from './middleware/errorHandler'

const app = express()

app.use(helmet())
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost',
    process.env.FRONTEND_URL??'',
  ].filter(Boolean),
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (_, res) => res.json({ success: true, message: 'Server is running' }))
app.use('/api/auth', authRoutes)
app.use('/api/leads', leadRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = Number(process.env.PORT) || 5000

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`))
  })
  .catch((err: Error) => {
    console.error('❌ Failed to connect to MongoDB:', err.message)
    console.error('Make sure MongoDB is running and MONGODB_URI in .env is correct')
    process.exit(1)
  })
