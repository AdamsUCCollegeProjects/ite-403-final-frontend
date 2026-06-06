<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import { PackageOpen } from 'lucide-vue-next'

defineProps<{
  message: string
  actionLabel?: string
  actionTo?: RouteLocationRaw
}>()
</script>

<template>
  <div class="flex flex-col items-center py-16 text-center">
    <div class="mb-4 rounded-full bg-slate-100 p-4">
      <PackageOpen class="h-8 w-8 text-muted-foreground" />
    </div>
    <p class="text-muted-foreground">{{ message }}</p>
    <RouterLink
      v-if="actionLabel && actionTo"
      :to="actionTo"
      class="btn-primary mt-6"
    >
      {{ actionLabel }}
    </RouterLink>
  </div>
</template>
