<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'

defineProps<{
  message: string
  actionLabel?: string
  actionTo?: RouteLocationRaw
}>()
</script>

<template>
  <div class="py-12 text-center">
    <p class="text-gray-500">{{ message }}</p>
    <RouterLink
      v-if="actionLabel && actionTo"
      :to="actionTo"
      class="mt-4 inline-block text-blue-600 hover:underline"
    >
      {{ actionLabel }}
    </RouterLink>
  </div>
</template>
