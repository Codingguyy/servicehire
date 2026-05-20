import { Request, Response, NextFunction } from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { fail } from '../utils/response'

export const validate = (chains:ValidationChain[]) =>
  async (req:Request, res:Response, next:NextFunction): Promise<void> => {
    for (const chain of chains) await chain.run(req)
    const errors = validationResult(req)
    if (!errors.isEmpty()) { fail(res, 400, 'Validation failed', errors.array().map(e => e.msg)); return}
    next()
  }
