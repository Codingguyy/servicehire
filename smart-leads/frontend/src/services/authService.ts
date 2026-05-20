import http from './api'
import { ApiResponse, AuthResponse, User } from '../types'

export const authService = {
  register:(data:{name:string; email: string; password: string; role?: string }) =>
    http.post<ApiResponse<AuthResponse>>('/auth/register', data),
  login: (data:{email: string; password: string }) =>
    http.post<ApiResponse<AuthResponse>>('/auth/login', data),
  getMe: () =>
    http.get<ApiResponse<User>>('/auth/me'),
  getUsers: () =>
    http.get<ApiResponse<User[]>>('/auth/users'),
}
