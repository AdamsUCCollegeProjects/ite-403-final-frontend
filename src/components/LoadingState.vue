<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
    <Loader2 class="h-8 w-8 animate-spin text-brand-600" role="status" aria-label="Loading" />
    <p class="text-sm">{{ message ?? 'Loading...' }}</p>
  </div>
</template>
