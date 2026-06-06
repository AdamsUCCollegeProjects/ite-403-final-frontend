import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import * as authApi from '@/api/auth'
import { ApiClientError } from '@/api/client'
import type { LoginPayload, RegisterPayload, User } from '@/types/api'
import { clearAuthToken, getAuthToken, setAuthToken } from '@/utils/storage'
import { useCartStore } from '@/stores/cart'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(getAuthToken())
  const user = ref<User | null>(null)
  const isInitializing = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value && user.value))
  const isAdmin = computed(() => user.value?.role === 'admin')

  function setSession(authToken: string, profile: User): void {
    setAuthToken(authToken)
    token.value = authToken
    user.value = profile
  }

  function clearSession(): void {
    clearAuthToken()
    token.value = null
    user.value = null
  }

  async function fetchProfile(): Promise<void> {
    const profile = await authApi.getProfile()
    user.value = profile
  }

  async function initialize(): Promise<void> {
    if (!token.value) {
      clearSession()
      return
    }

    isInitializing.value = true

    try {
      await fetchProfile()
      await useCartStore().fetchCart()
    } catch {
      clearSession()
      useCartStore().clearCart()
    } finally {
      isInitializing.value = false
    }
  }

  async function login(payload: LoginPayload): Promise<void> {
    const response = await authApi.login(payload)
    setAuthToken(response.token)
    token.value = response.token
    await fetchProfile()
    await useCartStore().fetchCart()
  }

  async function register(payload: RegisterPayload): Promise<void> {
    await authApi.register(payload)
  }

  async function adminRegister(payload: RegisterPayload): Promise<void> {
    await authApi.adminRegister(payload)
  }

  function logout(): void {
    clearSession()
    useCartStore().clearCart()
  }

  function getErrorMessage(error: unknown): string {
    if (error instanceof ApiClientError) {
      return error.message
    }

    return 'An unexpected error occurred'
  }

  function getFieldErrors(error: unknown): Record<string, string> | undefined {
    if (error instanceof ApiClientError) {
      return error.fieldErrors
    }

    return undefined
  }

  return {
    token,
    user,
    isInitializing,
    isAuthenticated,
    isAdmin,
    initialize,
    login,
    register,
    adminRegister,
    logout,
    clearSession,
    getErrorMessage,
    getFieldErrors,
  }
})
