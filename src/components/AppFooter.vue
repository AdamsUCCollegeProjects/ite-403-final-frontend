<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="mt-auto border-t border-slate-200 bg-white">
    <div class="page-container py-12">
      <div class="grid gap-8 md:grid-cols-3">
        <div>
          <p class="text-lg font-bold text-brand-600">Boutique</p>
          <p class="mt-2 text-sm text-muted-foreground">
            Curated essentials for everyday style. Quality products, simple shopping.
          </p>
        </div>

        <div>
          <p class="text-sm font-semibold text-slate-900">Shop</p>
          <nav class="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <RouterLink to="/" class="hover:text-brand-600">All products</RouterLink>
            <RouterLink to="/cart" class="hover:text-brand-600">Cart</RouterLink>
          </nav>
        </div>

        <div>
          <p class="text-sm font-semibold text-slate-900">Account</p>
          <nav class="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <RouterLink to="/login" class="hover:text-brand-600">Login</RouterLink>
            <RouterLink to="/register" class="hover:text-brand-600">Register</RouterLink>
            <RouterLink to="/orders" class="hover:text-brand-600">Order history</RouterLink>
          </nav>
        </div>
      </div>

      <p class="mt-10 border-t border-slate-100 pt-6 text-center text-xs text-muted-foreground">
        &copy; {{ new Date().getFullYear() }} Boutique Shop. All rights reserved.
      </p>
    </div>
  </footer>
</template>
