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
    class="hidden flex-col justify-between p-10 text-white lg:flex lg:w-1/2 lg:p-12"
    style="background-color: #3d2b1f; background-image: radial-gradient(circle at 80% 20%, rgba(194,112,62,0.25) 0%, transparent 55%), radial-gradient(circle at 10% 80%, rgba(194,112,62,0.15) 0%, transparent 50%);"
  >
    <div>
      <p class="flex items-center gap-2 text-lg font-bold">
        <ShoppingBag class="h-6 w-6" />
        Boutique
      </p>
      <h2 class="mt-10 text-3xl font-bold leading-tight">
        Your style,<br />delivered simply.
      </h2>
      <p class="mt-4 text-stone-300">
        Join thousands of shoppers discovering quality essentials every day.
      </p>
    </div>

    <ul class="space-y-4">
      <li
        v-for="feature in FEATURES"
        :key="feature.text"
        class="flex items-center gap-3 text-sm text-stone-300"
      >
        <div class="rounded-lg bg-white/10 p-2">
          <component :is="feature.icon" class="h-4 w-4" />
        </div>
        {{ feature.text }}
      </li>
    </ul>
  </div>
</template>
