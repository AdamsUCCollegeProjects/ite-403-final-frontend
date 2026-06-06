<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const route = useRoute()

const NAV_LINKS = [
  { to: '/admin', label: 'Dashboard', exact: true },
  { to: '/admin/categories', label: 'Categories', exact: false },
  { to: '/admin/products', label: 'Products', exact: false },
  { to: '/admin/orders', label: 'Orders', exact: false },
] as const

function isLinkActive(link: (typeof NAV_LINKS)[number]): boolean {
  if (link.exact) {
    return route.path === link.to
  }

  return route.path.startsWith(link.to)
}

function handleLogout(): void {
  authStore.logout()
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="border-b border-gray-200 bg-white">
      <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <h1 class="text-lg font-bold text-gray-900">Admin Panel</h1>
        <div class="flex items-center gap-4 text-sm">
          <RouterLink to="/" class="text-gray-600 hover:text-blue-600">Back to shop</RouterLink>
          <span class="text-gray-500">{{ authStore.user?.name }}</span>
          <button
            type="button"
            class="text-gray-600 hover:text-blue-600"
            @click="handleLogout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>

    <div class="mx-auto flex max-w-7xl gap-6 px-4 py-6">
      <aside class="w-48 shrink-0">
        <nav class="space-y-1 rounded-lg border border-gray-200 bg-white p-2">
          <RouterLink
            v-for="link in NAV_LINKS"
            :key="link.to"
            :to="link.to"
            class="block rounded-md px-3 py-2 text-sm font-medium"
            :class="
              isLinkActive(link)
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            "
          >
            {{ link.label }}
          </RouterLink>
        </nav>
      </aside>

      <main class="min-w-0 flex-1">
        <RouterView />
      </main>
    </div>
  </div>
</template>
