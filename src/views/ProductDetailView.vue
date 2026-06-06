<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import * as productsApi from '@/api/products'
import { ApiClientError } from '@/api/client'
import ErrorAlert from '@/components/ErrorAlert.vue'
import LoadingState from '@/components/LoadingState.vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types/api'
import { formatCurrency } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const product = ref<Product | null>(null)
const quantity = ref(1)
const isLoading = ref(true)
const isAdding = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const productId = computed(() => Number.parseInt(route.params.id as string, 10))
const maxQuantity = computed(() => product.value?.stock ?? 1)

async function loadProduct(): Promise<void> {
  isLoading.value = true
  errorMessage.value = ''

  try {
    product.value = await productsApi.getProduct(productId.value)
    quantity.value = 1
  } catch (error) {
    errorMessage.value =
      error instanceof ApiClientError ? error.message : 'Failed to load product'
  } finally {
    isLoading.value = false
  }
}

async function handleAddToCart(): Promise<void> {
  if (!authStore.isAuthenticated) {
    await router.push({
      path: '/login',
      query: { redirect: route.fullPath },
    })
    return
  }

  if (!product.value) {
    return
  }

  isAdding.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    await cartStore.addItem(product.value.id, quantity.value)
    successMessage.value = 'Added to cart'
  } catch (error) {
    errorMessage.value =
      error instanceof ApiClientError ? error.message : 'Failed to add to cart'
  } finally {
    isAdding.value = false
  }
}

onMounted(() => {
  void loadProduct()
})
</script>

<template>
  <div>
    <LoadingState v-if="isLoading" message="Loading product..." />
    <ErrorAlert v-else-if="errorMessage && !product" :message="errorMessage" />

    <div v-else-if="product" class="max-w-2xl">
      <h1 class="text-3xl font-bold text-gray-900">{{ product.name }}</h1>
      <p class="mt-4 text-2xl font-semibold text-blue-600">
        {{ formatCurrency(product.price) }}
      </p>
      <p class="mt-2 text-sm text-gray-500">{{ product.stock }} in stock</p>
      <p class="mt-6 text-gray-700">{{ product.description }}</p>

      <ErrorAlert v-if="errorMessage && product" class="mt-4" :message="errorMessage" />
      <p v-if="successMessage" class="mt-4 text-sm text-green-600">{{ successMessage }}</p>

      <div class="mt-6 flex items-center gap-4">
        <label class="text-sm font-medium text-gray-700" for="quantity">Quantity</label>
        <input
          id="quantity"
          v-model.number="quantity"
          type="number"
          min="1"
          :max="maxQuantity"
          class="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
        />
        <button
          type="button"
          class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          :disabled="isAdding || product.stock === 0"
          @click="handleAddToCart"
        >
          {{ isAdding ? 'Adding...' : 'Add to cart' }}
        </button>
      </div>
    </div>
  </div>
</template>
