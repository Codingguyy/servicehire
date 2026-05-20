import jwt from 'jsonwebtoken'
import { JwtPayload, UserRole } from '../types'

export const generateToken =(id:string,role:UserRole): string => {
  const secret =process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET not defined')
  return jwt.sign({id, role},secret,{expiresIn:process.env.JWT_EXPIRES_IN?? '7d' } as jwt.SignOptions)
}

export const verifyToken =(token: string):JwtPayload =>{
  const secret =process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET not defined')
  return jwt.verify(token, secret) as JwtPayload
}
