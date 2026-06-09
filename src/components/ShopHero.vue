<script setup lang="ts">
import { ArrowDown } from 'lucide-vue-next'

defineProps<{
  categoryCount?: number
  productCount?: number
}>()
</script>

<template>
  <section
    class="relative mb-10 overflow-hidden rounded-2xl px-6 py-12 text-white sm:px-10 sm:py-16"
    style="background-color: #3d2b1f; background-image: radial-gradient(circle at 80% 20%, rgba(194,112,62,0.25) 0%, transparent 55%), radial-gradient(circle at 10% 80%, rgba(194,112,62,0.15) 0%, transparent 50%);"
  >
    <div class="relative z-10 max-w-xl">
      <p class="text-sm font-medium uppercase tracking-wider text-amber-300">Handcrafted with care</p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Style that fits your everyday
      </h1>
      <p class="mt-4 text-stone-300">
        Discover curated clothes, shoes, and bags — handpicked for quality and comfort.
      </p>

      <div v-if="categoryCount !== undefined || productCount !== undefined" class="mt-6 flex gap-6 text-sm">
        <span v-if="categoryCount !== undefined">
          <span class="font-semibold">{{ categoryCount }}</span>
          categories
        </span>
        <span v-if="productCount !== undefined">
          <span class="font-semibold">{{ productCount }}</span>
          products
        </span>
      </div>

      <a
        href="#products"
        class="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-stone-900 shadow-md transition hover:bg-slate-100"
      >
        Browse products
        <ArrowDown class="h-4 w-4" />
      </a>
    </div>

    <div class="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10" />
    <div class="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-white/5" />
  </section>
</template>
