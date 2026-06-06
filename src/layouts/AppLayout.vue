<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()

function handleLogout(): void {
  authStore.logout()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="border-b border-gray-200 bg-white">
      <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <RouterLink to="/" class="text-xl font-bold text-blue-600">Shop</RouterLink>

        <div class="flex items-center gap-4 text-sm font-medium">
          <RouterLink to="/" class="text-gray-700 hover:text-blue-600">Products</RouterLink>

          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/cart"
            class="text-gray-700 hover:text-blue-600"
          >
            Cart
            <span
              v-if="cartStore.itemCount > 0"
              class="ml-1 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white"
            >
              {{ cartStore.itemCount }}
            </span>
          </RouterLink>

          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/orders"
            class="text-gray-700 hover:text-blue-600"
          >
            Orders
          </RouterLink>

          <RouterLink
            v-if="authStore.isAdmin"
            to="/admin"
            class="text-gray-700 hover:text-blue-600"
          >
            Admin
          </RouterLink>

          <template v-if="authStore.isAuthenticated">
            <span class="text-gray-500">{{ authStore.user?.name }}</span>
            <button
              type="button"
              class="text-gray-700 hover:text-blue-600"
              @click="handleLogout"
            >
              Logout
            </button>
          </template>

          <template v-else>
            <RouterLink to="/login" class="text-gray-700 hover:text-blue-600">Login</RouterLink>
            <RouterLink
              to="/register"
              class="rounded-lg bg-blue-600 px-3 py-1.5 text-white hover:bg-blue-700"
            >
              Register
            </RouterLink>
          </template>
        </div>
      </nav>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>
