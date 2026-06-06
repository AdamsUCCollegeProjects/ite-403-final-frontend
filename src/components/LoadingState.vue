<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 py-12 text-gray-500">
    <div
      class="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"
      role="status"
      aria-label="Loading"
    />
    <p>{{ message ?? 'Loading...' }}</p>
  </div>
</template>
