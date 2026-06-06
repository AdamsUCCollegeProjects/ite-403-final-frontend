<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import * as categoriesApi from '@/api/categories'
import * as productsApi from '@/api/products'
import CategoryFilter from '@/components/CategoryFilter.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import LoadingState from '@/components/LoadingState.vue'
import ProductCard from '@/components/ProductCard.vue'
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

const sectionTitle = computed(() => {
  if (selectedCategoryId.value === null) {
    return 'All products'
  }

  const category = categories.value.find((item) => item.id === selectedCategoryId.value)
  return category?.name ?? 'Products'
})

function getCategoryName(categoryId: number): string | undefined {
  return categories.value.find((category) => category.id === categoryId)?.name
}

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
    <ShopHero
      :category-count="categories.length || undefined"
      :product-count="products.length || undefined"
    />

    <section id="products">
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-xl font-bold text-slate-900">{{ sectionTitle }}</h2>
        <CategoryFilter
          v-if="categories.length > 0"
          :categories="categories"
          :selected-category-id="selectedCategoryId"
          @select="handleCategorySelect"
        />
      </div>

      <LoadingState v-if="isLoading" message="Loading products..." />
      <ErrorAlert v-else-if="errorMessage" :message="errorMessage" />

      <EmptyState v-else-if="products.length === 0" message="No products found." />

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
