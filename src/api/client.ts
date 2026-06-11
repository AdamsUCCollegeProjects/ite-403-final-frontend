import axios, { AxiosError, isAxiosError, type AxiosRequestConfig } from 'axios'

import router from '@/router'
import type { ApiErrorResponse, NormalizedApiError } from '@/types/api'
import { clearAuthToken, getAuthToken } from '@/utils/storage'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://7922-202-62-62-131.ngrok-free.app'

const AUTH_ENDPOINTS = ['/api/login', '/api/register', '/api/admin/register']

let unauthorizedHandler: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler
}

export class ApiClientError extends Error {
  fieldErrors?: Record<string, string>

  constructor(error: NormalizedApiError) {
    super(error.message)
    this.name = 'ApiClientError'
    this.fieldErrors = error.fieldErrors
  }
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  if (isAxiosError(error)) {
    const responseData = error.response?.data as ApiErrorResponse | undefined

    if (responseData?.error) {
      return {
        message: responseData.error,
        fieldErrors: responseData.details,
      }
    }

    if (error.message) {
      return { message: error.message }
    }
  }

  return { message: 'An unexpected error occurred' }
}

function isAuthEndpoint(url: string | undefined): boolean {
  if (!url) {
    return false
  }

  return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint))
}

function handleUnauthorized(error: AxiosError): void {
  const requestUrl = error.config?.url

  if (isAuthEndpoint(requestUrl)) {
    return
  }

  clearAuthToken()
  unauthorizedHandler?.()

  const currentPath = router.currentRoute.value.fullPath

  if (currentPath.startsWith('/login')) {
    return
  }

  void router.push({
    path: '/login',
    query: { redirect: currentPath },
  })
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      handleUnauthorized(error)
    }

    return Promise.reject(error)
  },
)

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await apiClient.request<T>(config)
    return response.data
  } catch (error) {
    throw new ApiClientError(normalizeApiError(error))
  }
}
