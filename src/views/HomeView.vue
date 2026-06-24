<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import * as categoriesApi from '@/api/categories'
import * as productsApi from '@/api/products'
import CategoryFilter from '@/components/CategoryFilter.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import LoadingState from '@/components/LoadingState.vue'
import ProductCard from '@/components/ProductCard.vue'
import ProductSearchInput from '@/components/ProductSearchInput.vue'
import ShopHero from '@/components/ShopHero.vue'
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

const searchQuery = computed(() => {
  const query = route.query.q

  if (typeof query !== 'string') {
    return ''
  }

  return query.trim()
})

const sectionTitle = computed(() => {
  if (searchQuery.value !== '') {
    return `Results for "${searchQuery.value}"`
  }

  if (selectedCategoryId.value === null) {
    return 'All products'
  }

  const category = categories.value.find((item) => item.id === selectedCategoryId.value)
  return category?.name ?? 'Products'
})

const emptyStateMessage = computed(() => {
  if (searchQuery.value !== '') {
    return `No products match "${searchQuery.value}".`
  }

  if (selectedCategoryId.value !== null) {
    return 'No products in this category.'
  }

  return 'No products found.'
})

const showHeroStats = computed(() => !isLoading.value && errorMessage.value === '')

function getCategoryName(categoryId: number): string | undefined {
  return categories.value.find((category) => category.id === categoryId)?.name
}

function buildShopQuery(categoryId: number | null, search: string): Record<string, string> {
  const query: Record<string, string> = {}

  if (categoryId !== null) {
    query.category_id = String(categoryId)
  }

  const trimmedSearch = search.trim()
  if (trimmedSearch !== '') {
    query.q = trimmedSearch
  }

  return query
}

async function loadShopData(): Promise<void> {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const [categoryList, productList] = await Promise.all([
      categoriesApi.getCategories(),
      productsApi.getProducts({
        categoryId: selectedCategoryId.value ?? undefined,
        searchQuery: searchQuery.value || undefined,
      }),
    ])

    categories.value = categoryList
    products.value = productList
  } catch (error) {
    errorMessage.value =
      error instanceof ApiClientError ? error.message : 'Failed to load products'
    products.value = []
    categories.value = []
  } finally {
    isLoading.value = false
  }
}

function handleCategorySelect(categoryId: number | null): void {
  void router.push({
    path: '/',
    query: buildShopQuery(categoryId, searchQuery.value),
  })
}

function handleSearchChange(search: string): void {
  void router.push({
    path: '/',
    query: buildShopQuery(selectedCategoryId.value, search),
  })
}

watch(
  () => [selectedCategoryId.value, searchQuery.value] as const,
  () => {
    void loadShopData()
  },
  { immediate: true },
)
</script>

<template>
  <div>
    <ShopHero
      :category-count="showHeroStats ? categories.length : undefined"
      :product-count="showHeroStats ? products.length : undefined"
    />

    <section id="products">
      <div class="mb-6 flex flex-col gap-4">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-xl font-bold text-slate-900">{{ sectionTitle }}</h2>
          <ProductSearchInput :model-value="searchQuery" @update:model-value="handleSearchChange" />
        </div>

        <CategoryFilter
          v-if="!isLoading && categories.length > 0"
          :categories="categories"
          :selected-category-id="selectedCategoryId"
          @select="handleCategorySelect"
        />
      </div>

      <LoadingState v-if="isLoading" message="Loading products..." />
      <ErrorAlert v-else-if="errorMessage" :message="errorMessage" />
      <EmptyState v-else-if="products.length === 0" :message="emptyStateMessage" />

      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :category-name="getCategoryName(product.category_id)"
        />
      </div>
    </section>
  </div>
</template>
