import { Response, NextFunction } from 'express'
import { AuthRequest, UserRole } from '../types'
import { verifyToken } from '../utils/jwt'
import { fail } from '../utils/response'

export const authenticate = (req:AuthRequest,res:Response,next:NextFunction):void =>{
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) { fail(res, 401, 'No token provided'); return }
  try {
    const decoded = verifyToken(header.split(' ')[1])
    req.user ={id: decoded.id, role: decoded.role}
    next()
  } catch {
    fail(res, 401, 'Invalid or expired token')
  }
}

export const authorize = (...roles: UserRole[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) { fail(res, 401, 'Not authenticated'); return }
    if (!roles.includes(req.user.role)) { fail(res, 403, 'Permission denied'); return }
    next()
  }
