<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import * as categoriesApi from '@/api/categories'
import * as productsApi from '@/api/products'
import CategoryFilter from '@/components/CategoryFilter.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import LoadingState from '@/components/LoadingState.vue'
import ProductCard from '@/components/ProductCard.vue'
import { ApiClientError } from '@/api/client'
import type { Category, Product } from '@/types/api'

const route = useRoute()
const router = useRouter()

const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

const selectedCategoryId = computed(() => {
  const categoryId = route.query.category_id

  if (typeof categoryId !== 'string' || categoryId === '') {
    return null
  }

  const parsedId = Number.parseInt(categoryId, 10)
  return Number.isNaN(parsedId) ? null : parsedId
})

async function loadShopData(): Promise<void> {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const [categoryList, productList] = await Promise.all([
      categoriesApi.getCategories(),
      productsApi.getProducts(selectedCategoryId.value ?? undefined),
    ])

    categories.value = categoryList
    products.value = productList
  } catch (error) {
    errorMessage.value =
      error instanceof ApiClientError ? error.message : 'Failed to load products'
  } finally {
    isLoading.value = false
  }
}

function handleCategorySelect(categoryId: number | null): void {
  const query = categoryId === null ? {} : { category_id: String(categoryId) }
  void router.push({ path: '/', query })
}

onMounted(() => {
  void loadShopData()
})

watch(selectedCategoryId, () => {
  void loadShopData()
})
</script>

<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold text-gray-900">Products</h1>

    <CategoryFilter
      v-if="categories.length > 0"
      class="mb-8"
      :categories="categories"
      :selected-category-id="selectedCategoryId"
      @select="handleCategorySelect"
    />

    <LoadingState v-if="isLoading" message="Loading products..." />
    <ErrorAlert v-else-if="errorMessage" :message="errorMessage" />

    <div v-else-if="products.length === 0" class="py-12 text-center text-gray-500">
      No products found.
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </div>
</template>
