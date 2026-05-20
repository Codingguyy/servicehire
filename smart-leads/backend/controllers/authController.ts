import { Response, NextFunction } from 'express'
import User from '../models/User'
import { generateToken } from '../utils/jwt'
import { ok, created, fail } from '../utils/response'
import { AuthRequest } from '../types'

export const register =async (req:AuthRequest,res:Response, next:NextFunction):Promise<void> =>{
  try {
    const {name, email, password, role} = req.body
    if (await User.findOne({ email })) { fail(res, 409, 'Email already exists'); return }
    const user = await User.create({ name, email, password, role: role?? 'sales'})
    const token =generateToken(user._id.toString(), user.role)
    created(res, 'Registration successful', { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (e){ next(e)}
}

export const login =async (req:AuthRequest,res:Response,next: NextFunction):Promise<void> => {
  try {
    const {email, password} = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) { fail(res, 401, 'Invalid email or password'); return }
    const token = generateToken(user._id.toString(), user.role)
    ok(res, 'Login successful', { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (e){ next(e)}
}

export const getMe=async(req:AuthRequest,res:Response,next: NextFunction):Promise<void> =>{
  try {
    const user = await User.findById(req.user?.id)
    if (!user) {fail(res, 404, 'User not found'); return}
    ok(res, 'User fetched', { id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt })
  } catch (e){next(e)}
}

export const getUsers=async (_req:AuthRequest,res:Response,next:NextFunction):Promise<void> =>{
  try {
    const users =await User.find().select('-password').sort({ createdAt: -1})
    ok(res, 'Users fetched', users)
  } catch (e){ next(e)}
}
