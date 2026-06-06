<script setup lang="ts">
import { computed } from 'vue'

import { getCategoryInitial, getCategoryVisual } from '@/utils/categoryVisuals'

const props = withDefaults(
  defineProps<{
    categoryId?: number
    categoryName?: string
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    size: 'md',
  },
)

const visual = computed(() => getCategoryVisual(props.categoryName, props.categoryId))
const initial = computed(() => getCategoryInitial(props.categoryName))

const SIZE_CLASSES = {
  sm: { container: 'h-24', icon: 'h-8 w-8', text: 'text-lg' },
  md: { container: 'aspect-square', icon: 'h-12 w-12', text: 'text-2xl' },
  lg: { container: 'aspect-square min-h-80', icon: 'h-16 w-16', text: 'text-4xl' },
} as const

const sizeClass = computed(() => SIZE_CLASSES[props.size])
</script>

<template>
  <div
    class="relative flex w-full items-center justify-center overflow-hidden rounded-t-xl bg-gradient-to-br"
    :class="[sizeClass.container, visual.gradient]"
  >
    <component :is="visual.icon" class="text-white/30" :class="sizeClass.icon" />
    <span
      class="absolute font-bold text-white/80"
      :class="sizeClass.text"
    >
      {{ initial }}
    </span>
  </div>
</template>
