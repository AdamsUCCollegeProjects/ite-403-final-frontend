<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="flex items-center justify-center py-12 text-gray-500">
    <p>{{ message ?? 'Loading...' }}</p>
  </div>
</template>
