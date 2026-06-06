<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import { ChevronLeft } from 'lucide-vue-next'

defineProps<{
  title: string
  subtitle?: string
  backTo?: RouteLocationRaw
  backLabel?: string
  compact?: boolean
}>()
</script>

<template>
  <div :class="compact ? 'mb-0' : 'mb-8'">
    <RouterLink
      v-if="backTo"
      :to="backTo"
      class="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-brand-600"
    >
      <ChevronLeft class="h-4 w-4" />
      {{ backLabel ?? 'Back' }}
    </RouterLink>

    <h1 class="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{{ title }}</h1>
    <p v-if="subtitle" class="mt-1 text-muted-foreground">{{ subtitle }}</p>
  </div>
</template>
