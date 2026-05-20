import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import { fail } from '../utils/response'

interface AppError extends Error {
  statusCode?: number
  code?: number
  keyValue?: Record<string, unknown>
  errors?: Record<string, { message: string }>
  path?: string
  value?: string
}

export const errorHandler = (err:AppError,_req:Request,res: Response,_next:NextFunction): void => {
  let status = err.statusCode ?? 500
  let message = err.message ?? 'Internal Server Error'

  if (err instanceof mongoose.Error.CastError){ status = 400; message = `Invalid ${err.path}` }
  if (err.code === 11000 && err.keyValue) { status = 409; message = `${Object.keys(err.keyValue)[0]} already exists` }
  if (err instanceof mongoose.Error.ValidationError) {
    fail(res, 400, 'Validation failed', Object.values(err.errors).map(e => e.message))
    return
  }

  fail(res, status, message)
}

export const notFound =(_req:Request,res:Response):void => {
  fail(res, 404, 'Route not found')
}
