import {Response } from 'express'
import {ApiResponse,PaginationMeta} from '../types'

export const ok =<T>(res:Response,message:string,data?:T, meta?:PaginationMeta) =>
  res.status(200).json({success:true, message, data, meta } as ApiResponse<T>)

export const created =<T>(res:Response,message:string,data?: T)=>
  res.status(201).json({success:true, message, data } as ApiResponse<T>)

export const fail =(res:Response,status:number,message:string,errors?:string[]) =>
  res.status(status).json({success:false, message, errors } as ApiResponse)
