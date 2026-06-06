<script setup lang="ts">
import { ShoppingBag, Sparkles, Truck } from 'lucide-vue-next'

const FEATURES = [
  { icon: Sparkles, text: 'Curated products for everyday style' },
  { icon: Truck, text: 'Fast checkout with secure shipping' },
  { icon: ShoppingBag, text: 'Browse by category with ease' },
] as const
</script>

<template>
  <div
    class="hidden flex-col justify-between bg-gradient-to-br from-brand-600 via-indigo-600 to-violet-700 p-10 text-white lg:flex lg:w-1/2 lg:p-12"
  >
    <div>
      <p class="flex items-center gap-2 text-lg font-bold">
        <ShoppingBag class="h-6 w-6" />
        Boutique
      </p>
      <h2 class="mt-10 text-3xl font-bold leading-tight">
        Your style,<br />delivered simply.
      </h2>
      <p class="mt-4 text-indigo-100">
        Join thousands of shoppers discovering quality essentials every day.
      </p>
    </div>

    <ul class="space-y-4">
      <li
        v-for="feature in FEATURES"
        :key="feature.text"
        class="flex items-center gap-3 text-sm text-indigo-100"
      >
        <div class="rounded-lg bg-white/10 p-2">
          <component :is="feature.icon" class="h-4 w-4" />
        </div>
        {{ feature.text }}
      </li>
    </ul>
  </div>
</template>
