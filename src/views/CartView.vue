<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { ApiClientError } from '@/api/client'
import CartItemRow from '@/components/CartItemRow.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import LoadingState from '@/components/LoadingState.vue'
import { useCartStore } from '@/stores/cart'
import { formatCurrency } from '@/utils/format'

const cartStore = useCartStore()
const errorMessage = ref('')
const updatingProductId = ref<number | null>(null)

async function loadCart(): Promise<void> {
  errorMessage.value = ''

  try {
    await cartStore.fetchCart()
  } catch (error) {
    errorMessage.value =
      error instanceof ApiClientError ? error.message : 'Failed to load cart'
  }
}

async function handleUpdateQuantity(productId: number, quantity: number): Promise<void> {
  updatingProductId.value = productId
  errorMessage.value = ''

  try {
    await cartStore.updateQuantity(productId, quantity)
  } catch (error) {
    errorMessage.value =
      error instanceof ApiClientError ? error.message : 'Failed to update quantity'
  } finally {
    updatingProductId.value = null
  }
}

async function handleRemove(productId: number): Promise<void> {
  updatingProductId.value = productId
  errorMessage.value = ''

  try {
    await cartStore.removeItem(productId)
  } catch (error) {
    errorMessage.value =
      error instanceof ApiClientError ? error.message : 'Failed to remove item'
  } finally {
    updatingProductId.value = null
  }
}

onMounted(() => {
  void loadCart()
})
</script>

<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold text-gray-900">Shopping Cart</h1>

    <LoadingState v-if="cartStore.isLoading && cartStore.items.length === 0" />
    <ErrorAlert v-else-if="errorMessage" class="mb-4" :message="errorMessage" />

    <div v-if="!cartStore.isLoading && cartStore.items.length === 0" class="py-12 text-center">
      <p class="text-gray-500">Your cart is empty.</p>
      <RouterLink to="/" class="mt-4 inline-block text-blue-600 hover:underline">
        Continue shopping
      </RouterLink>
    </div>

    <div v-else-if="cartStore.items.length > 0">
      <div class="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table class="min-w-full text-left text-sm">
          <thead class="border-b border-gray-200 bg-gray-50">
            <tr>
              <th class="px-4 py-3 font-medium text-gray-700">Product</th>
              <th class="px-4 py-3 font-medium text-gray-700">Price</th>
              <th class="px-4 py-3 font-medium text-gray-700">Quantity</th>
              <th class="px-4 py-3 font-medium text-gray-700">Total</th>
              <th class="px-4 py-3 font-medium text-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            <CartItemRow
              v-for="item in cartStore.items"
              :key="item.id"
              :item="item"
              :is-updating="updatingProductId === item.product_id"
              @update-quantity="handleUpdateQuantity(item.product_id, $event)"
              @remove="handleRemove(item.product_id)"
            />
          </tbody>
        </table>
      </div>

      <div class="mt-6 flex items-center justify-between">
        <p class="text-lg font-semibold text-gray-900">
          Total: {{ formatCurrency(cartStore.total) }}
        </p>
        <RouterLink
          to="/checkout"
          class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          Proceed to checkout
        </RouterLink>
      </div>
    </div>
  </div>
</template>
