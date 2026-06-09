<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import ProductImage from '@/components/ProductImage.vue'
import type { Product } from '@/types/api'
import { formatCurrency } from '@/utils/format'

const props = defineProps<{
  product: Product
  categoryName?: string
}>()

const stockBadgeClass = computed(() => {
  if (props.product.stock === 0) {
    return 'bg-red-100 text-red-700'
  }

  if (props.product.stock <= 5) {
    return 'bg-amber-100 text-amber-700'
  }

  return 'bg-green-100 text-green-700'
})

const stockLabel = computed(() => {
  if (props.product.stock === 0) {
    return 'Out of stock'
  }

  if (props.product.stock <= 5) {
    return `${props.product.stock} left`
  }

  return 'In stock'
})
</script>

<template>
  <RouterLink
    :to="{ name: 'product-detail', params: { id: product.id } }"
    class="group card block overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
  >
    <ProductImage
      :thumbnail-url="product.thumbnail_url"
      :category-id="product.category_id"
      :category-name="categoryName"
      :alt="product.name"
      size="md"
    />

    <div class="p-4">
      <div class="mb-2 flex items-start justify-between gap-2">
        <span
          v-if="categoryName"
          class="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-800"
        >
          {{ categoryName }}
        </span>
        <span class="rounded-full px-2 py-0.5 text-xs font-medium" :class="stockBadgeClass">
          {{ stockLabel }}
        </span>
      </div>

      <h3 class="font-semibold text-slate-900 group-hover:text-brand-600">{{ product.name }}</h3>
      <p class="mt-1 line-clamp-2 text-sm text-muted-foreground">{{ product.description }}</p>
      <p class="mt-3 text-lg font-bold text-brand-600">{{ formatCurrency(product.price) }}</p>
    </div>
  </RouterLink>
</template>
