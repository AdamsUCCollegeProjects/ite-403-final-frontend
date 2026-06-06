<script setup lang="ts">
import { RouterLink } from 'vue-router'

import type { Product } from '@/types/api'
import { formatCurrency } from '@/utils/format'

defineProps<{
  product: Product
}>()
</script>

<template>
  <RouterLink
    :to="{ name: 'product-detail', params: { id: product.id } }"
    class="block rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md"
  >
    <h3 class="font-semibold text-gray-900">{{ product.name }}</h3>
    <p class="mt-2 line-clamp-2 text-sm text-gray-600">{{ product.description }}</p>
    <p class="mt-3 text-lg font-bold text-blue-600">{{ formatCurrency(product.price) }}</p>
    <p class="mt-1 text-xs text-gray-500">{{ product.stock }} in stock</p>
  </RouterLink>
</template>
