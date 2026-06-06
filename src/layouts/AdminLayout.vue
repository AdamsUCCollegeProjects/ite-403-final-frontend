<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import {
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Tags,
} from 'lucide-vue-next'

import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const route = useRoute()

const NAV_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/categories', label: 'Categories', icon: Tags, exact: false },
  { to: '/admin/products', label: 'Products', icon: Package, exact: false },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag, exact: false },
] as const

function isLinkActive(link: (typeof NAV_LINKS)[number]): boolean {
  if (link.exact) {
    return route.path === link.to
  }

  return route.path.startsWith(link.to)
}

function getNavLinkClass(isActive: boolean): string {
  if (isActive) {
    return 'border-l-2 border-brand-600 bg-slate-800 text-white'
  }

  return 'border-l-2 border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
}

function handleLogout(): void {
  authStore.logout()
}
</script>

<template>
  <div class="flex min-h-screen bg-muted">
    <aside class="flex w-60 shrink-0 flex-col bg-slate-900 text-white">
      <div class="border-b border-slate-800 px-5 py-6">
        <p class="text-lg font-bold text-white">Boutique</p>
        <p class="text-xs text-slate-400">Admin Panel</p>
      </div>

      <nav class="flex-1 space-y-1 px-3 py-4">
        <RouterLink
          v-for="link in NAV_LINKS"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-3 rounded-r-lg px-3 py-2.5 text-sm font-medium transition-colors"
          :class="getNavLinkClass(isLinkActive(link))"
        >
          <component :is="link.icon" class="h-4 w-4 shrink-0" />
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="border-t border-slate-800 p-4">
        <RouterLink
          to="/"
          class="mb-3 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ExternalLink class="h-4 w-4" />
          Back to shop
        </RouterLink>
        <div class="flex items-center justify-between">
          <span class="truncate text-sm text-slate-400">{{ authStore.user?.name }}</span>
          <button
            type="button"
            class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Logout"
            @click="handleLogout"
          >
            <LogOut class="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>

    <main class="min-w-0 flex-1 overflow-auto p-6 lg:p-8">
      <RouterView />
    </main>
  </div>
</template>
