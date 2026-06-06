<script setup lang="ts">
defineProps<{
  padding?: boolean
}>()
</script>

<template>
  <div class="card" :class="padding !== false ? 'p-6' : ''">
    <slot />
  </div>
</template>
