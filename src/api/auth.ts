import { apiRequest } from '@/api/client'
import type { LoginPayload, LoginResponse, RegisterPayload, User } from '@/types/api'

export function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiRequest<LoginResponse>({
    method: 'POST',
    url: '/api/login',
    data: payload,
  })
}

export function register(payload: RegisterPayload): Promise<User> {
  return apiRequest<User>({
    method: 'POST',
    url: '/api/register',
    data: payload,
  })
}

export function adminRegister(payload: RegisterPayload): Promise<User> {
  return apiRequest<User>({
    method: 'POST',
    url: '/api/admin/register',
    data: payload,
  })
}

export function getProfile(): Promise<User> {
  return apiRequest<User>({
    method: 'GET',
    url: '/api/profile',
  })
}
