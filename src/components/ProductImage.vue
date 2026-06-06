<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import ProductImagePlaceholder from '@/components/ProductImagePlaceholder.vue'
import { resolveApiUrl } from '@/utils/resolveApiUrl'

const props = withDefaults(
  defineProps<{
    thumbnailUrl?: string | null
    imageUrl?: string | null
    categoryId?: number
    categoryName?: string
    size?: 'sm' | 'md' | 'lg'
    alt?: string
  }>(),
  {
    size: 'md',
  },
)

const hasImageError = ref(false)

const displayUrl = computed(() => {
  const sourceUrl = props.imageUrl ?? props.thumbnailUrl
  return resolveApiUrl(sourceUrl)
})

const showImage = computed(() => Boolean(displayUrl.value) && !hasImageError.value)

const SIZE_CLASSES = {
  sm: 'h-24 w-full',
  md: 'aspect-square w-full',
  lg: 'aspect-square min-h-80 w-full',
} as const

watch(displayUrl, () => {
  hasImageError.value = false
})
</script>

<template>
  <img
    v-if="showImage"
    :src="displayUrl!"
    :alt="alt ?? categoryName ?? 'Product image'"
    loading="lazy"
    class="rounded-t-xl object-cover"
    :class="SIZE_CLASSES[size]"
    @error="hasImageError = true"
  />
  <ProductImagePlaceholder
    v-else
    :category-id="categoryId"
    :category-name="categoryName"
    :size="size"
  />
</template>
