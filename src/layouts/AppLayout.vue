<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import {
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  ShoppingCart,
  User,
} from 'lucide-vue-next'

import AppFooter from '@/components/AppFooter.vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const authStore = useAuthStore()
const cartStore = useCartStore()
const route = useRoute()
const isScrolled = ref(false)

const isAuthPage = computed(() => route.name === 'login' || route.name === 'register')

const userInitials = computed(() => {
  const name = authStore.user?.name ?? ''
  const parts = name.trim().split(/\s+/)

  if (parts.length >= 2) {
    return `${parts[0]?.charAt(0) ?? ''}${parts[1]?.charAt(0) ?? ''}`.toUpperCase()
  }

  return name.charAt(0).toUpperCase() || '?'
})

function handleScroll(): void {
  isScrolled.value = window.scrollY > 8
}

function handleLogout(): void {
  authStore.logout()
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-muted">
    <header
      class="sticky top-0 z-50 transition-all duration-200"
      :class="
        isScrolled
          ? 'border-b border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-md'
          : 'border-b border-transparent bg-white'
      "
    >
      <nav class="page-container flex items-center justify-between py-4">
        <RouterLink to="/" class="flex items-center gap-2 text-xl font-bold text-brand-600">
          <ShoppingBag class="h-6 w-6" />
          Boutique
        </RouterLink>

        <div class="flex items-center gap-1 sm:gap-2">
          <RouterLink to="/" class="btn-ghost hidden sm:inline-flex">
            <Package class="h-4 w-4" />
            Products
          </RouterLink>

          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/cart"
            class="btn-ghost relative"
            aria-label="Cart"
          >
            <ShoppingCart class="h-4 w-4" />
            <span class="hidden sm:inline">Cart</span>
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-xs font-semibold text-white"
            >
              {{ cartStore.itemCount }}
            </span>
          </RouterLink>

          <RouterLink
            v-if="authStore.isAuthenticated"
            to="/orders"
            class="btn-ghost hidden sm:inline-flex"
          >
            Orders
          </RouterLink>

          <RouterLink
            v-if="authStore.isAdmin"
            to="/admin"
            class="btn-ghost hidden sm:inline-flex"
          >
            <LayoutDashboard class="h-4 w-4" />
            Admin
          </RouterLink>

          <template v-if="authStore.isAuthenticated">
            <div class="hidden items-center gap-2 pl-2 sm:flex">
              <div
                class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700"
              >
                {{ userInitials }}
              </div>
              <span class="max-w-24 truncate text-sm text-slate-600">{{ authStore.user?.name }}</span>
            </div>
            <button type="button" class="btn-ghost" aria-label="Logout" @click="handleLogout">
              <LogOut class="h-4 w-4" />
              <span class="hidden sm:inline">Logout</span>
            </button>
          </template>

          <template v-else>
            <RouterLink to="/login" class="btn-ghost">
              <User class="h-4 w-4 sm:hidden" />
              <span class="hidden sm:inline">Login</span>
            </RouterLink>
            <RouterLink to="/register" class="btn-primary btn-sm sm:btn">
              Register
            </RouterLink>
          </template>
        </div>
      </nav>
    </header>

    <main class="flex-1" :class="isAuthPage ? '' : 'page-container py-8'">
      <RouterView />
    </main>

    <AppFooter v-if="!isAuthPage" />
  </div>
</template>
