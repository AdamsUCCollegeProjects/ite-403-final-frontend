<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CheckCircle, Loader2, Minus, Plus, ShoppingCart } from 'lucide-vue-next'

import * as categoriesApi from '@/api/categories'
import * as productsApi from '@/api/products'
import { ApiClientError } from '@/api/client'
import Button from '@/components/Button.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import LoadingState from '@/components/LoadingState.vue'
import PageHeader from '@/components/PageHeader.vue'
import ProductImagePlaceholder from '@/components/ProductImagePlaceholder.vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import type { Category, Product } from '@/types/api'
import { formatCurrency } from '@/utils/format'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const product = ref<Product | null>(null)
const category = ref<Category | null>(null)
const quantity = ref(1)
const isLoading = ref(true)
const isAdding = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const productId = computed(() => Number.parseInt(route.params.id as string, 10))
const maxQuantity = computed(() => product.value?.stock ?? 1)

function decrementQuantity(): void {
  if (quantity.value > 1) {
    quantity.value -= 1
  }
}

function incrementQuantity(): void {
  if (quantity.value < maxQuantity.value) {
    quantity.value += 1
  }
}

async function loadProduct(): Promise<void> {
  isLoading.value = true
  errorMessage.value = ''

  try {
    product.value = await productsApi.getProduct(productId.value)
    quantity.value = 1

    if (product.value) {
      category.value = await categoriesApi.getCategory(product.value.category_id)
    }
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
    successMessage.value = 'Added to cart successfully!'
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

    <div v-else-if="product">
      <PageHeader
        :title="product.name"
        :subtitle="category?.name"
        back-to="/"
        back-label="Back to products"
      />

      <div class="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div class="card overflow-hidden">
          <ProductImagePlaceholder
            :category-id="product.category_id"
            :category-name="category?.name"
            size="lg"
          />
        </div>

        <div>
          <p class="text-3xl font-bold text-brand-600">{{ formatCurrency(product.price) }}</p>

          <p class="mt-2 text-sm text-muted-foreground">
            <span
              class="rounded-full px-2 py-0.5 font-medium"
              :class="
                product.stock === 0
                  ? 'bg-red-100 text-red-700'
                  : product.stock <= 5
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-green-100 text-green-700'
              "
            >
              {{ product.stock === 0 ? 'Out of stock' : `${product.stock} in stock` }}
            </span>
          </p>

          <p class="mt-6 leading-relaxed text-slate-700">{{ product.description }}</p>

          <ErrorAlert v-if="errorMessage && product" class="mt-6" :message="errorMessage" />

          <div v-if="successMessage" class="success-banner mt-6 flex items-center gap-2">
            <CheckCircle class="h-4 w-4 shrink-0" />
            {{ successMessage }}
          </div>

          <div class="mt-8 flex flex-wrap items-center gap-4">
            <div class="flex items-center rounded-lg border border-slate-200">
              <button
                type="button"
                class="flex h-10 w-10 items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                :disabled="quantity <= 1"
                aria-label="Decrease quantity"
                @click="decrementQuantity"
              >
                <Minus class="h-4 w-4" />
              </button>
              <span class="w-12 text-center text-sm font-medium">{{ quantity }}</span>
              <button
                type="button"
                class="flex h-10 w-10 items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                :disabled="quantity >= maxQuantity"
                aria-label="Increase quantity"
                @click="incrementQuantity"
              >
                <Plus class="h-4 w-4" />
              </button>
            </div>

            <Button
              :disabled="isAdding || product.stock === 0"
              @click="handleAddToCart"
            >
              <Loader2 v-if="isAdding" class="h-4 w-4 animate-spin" />
              <ShoppingCart v-else class="h-4 w-4" />
              {{ isAdding ? 'Adding...' : 'Add to cart' }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
