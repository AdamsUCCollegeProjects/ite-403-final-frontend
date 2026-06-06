<script setup lang="ts">
import type { Category } from '@/types/api'

defineProps<{
  categories: Category[]
  selectedCategoryId: number | null
}>()

const emit = defineEmits<{
  select: [categoryId: number | null]
}>()

function getPillClass(isActive: boolean): string {
  if (isActive) {
    return 'bg-brand-600 text-white ring-2 ring-brand-600 ring-offset-2 scale-105'
  }

  return 'bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-brand-300 hover:scale-105'
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      type="button"
      class="rounded-full px-4 py-2 text-sm font-medium transition-all duration-150"
      :class="getPillClass(selectedCategoryId === null)"
      @click="emit('select', null)"
    >
      All
    </button>
    <button
      v-for="category in categories"
      :key="category.id"
      type="button"
      class="rounded-full px-4 py-2 text-sm font-medium transition-all duration-150"
      :class="getPillClass(selectedCategoryId === category.id)"
      @click="emit('select', category.id)"
    >
      {{ category.name }}
    </button>
  </div>
</template>
