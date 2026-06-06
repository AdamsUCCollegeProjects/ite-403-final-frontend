<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  label: string
  value: string | number
  icon: Component
  iconBgClass: string
  iconColorClass: string
}>()
</script>

<template>
  <div class="card p-5">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm font-medium text-muted-foreground">{{ label }}</p>
        <p class="mt-2 text-2xl font-bold tracking-tight text-slate-900">{{ value }}</p>
      </div>
      <div class="rounded-xl p-3" :class="iconBgClass">
        <component :is="icon" class="h-5 w-5" :class="iconColorClass" />
      </div>
    </div>
  </div>
</template>
