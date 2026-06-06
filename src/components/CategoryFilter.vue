<script setup lang="ts">
import type { Category } from '@/types/api'

defineProps<{
  categories: Category[]
  selectedCategoryId: number | null
}>()

const emit = defineEmits<{
  select: [categoryId: number | null]
}>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      type="button"
      class="rounded-full px-4 py-1.5 text-sm font-medium transition"
      :class="
        selectedCategoryId === null
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      "
      @click="emit('select', null)"
    >
      All
    </button>
    <button
      v-for="category in categories"
      :key="category.id"
      type="button"
      class="rounded-full px-4 py-1.5 text-sm font-medium transition"
      :class="
        selectedCategoryId === category.id
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      "
      @click="emit('select', category.id)"
    >
      {{ category.name }}
    </button>
  </div>
</template>
