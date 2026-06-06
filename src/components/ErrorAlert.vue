<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'

defineProps<{
  message: string
}>()
</script>

<template>
  <div
    class="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    role="alert"
  >
    <AlertCircle class="mt-0.5 h-4 w-4 shrink-0" />
    <span>{{ message }}</span>
  </div>
</template>
