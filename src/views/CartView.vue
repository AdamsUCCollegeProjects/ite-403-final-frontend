<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { ApiClientError } from '@/api/client'
import CartItemRow from '@/components/CartItemRow.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import LoadingState from '@/components/LoadingState.vue'
import PageHeader from '@/components/PageHeader.vue'
import { useCartStore } from '@/stores/cart'
import { formatCurrency } from '@/utils/format'

const cartStore = useCartStore()
const errorMessage = ref('')
const updatingProductId = ref<number | null>(null)

const itemCount = computed(() => cartStore.itemCount)

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
    <PageHeader title="Shopping Cart" :subtitle="`${itemCount} item${itemCount === 1 ? '' : 's'}`" />

    <LoadingState v-if="cartStore.isLoading && cartStore.items.length === 0" />
    <ErrorAlert v-else-if="errorMessage" class="mb-4" :message="errorMessage" />

    <EmptyState
      v-if="!cartStore.isLoading && cartStore.items.length === 0"
      message="Your cart is empty."
      action-label="Continue shopping"
      action-to="/"
    />

    <div v-else-if="cartStore.items.length > 0" class="grid gap-8 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <div class="table-container">
          <table class="min-w-full text-left text-sm">
            <thead class="table-header">
              <tr>
                <th class="px-4 py-3 font-semibold text-slate-700">Product</th>
                <th class="px-4 py-3 font-semibold text-slate-700">Price</th>
                <th class="px-4 py-3 font-semibold text-slate-700">Quantity</th>
                <th class="px-4 py-3 font-semibold text-slate-700">Total</th>
                <th class="px-4 py-3 font-semibold text-slate-700"></th>
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
      </div>

      <aside class="lg:col-span-1">
        <div class="card sticky top-24 p-6">
          <h2 class="text-lg font-semibold text-slate-900">Order summary</h2>

          <dl class="mt-4 space-y-3 text-sm">
            <div class="flex justify-between text-muted-foreground">
              <dt>Items</dt>
              <dd>{{ itemCount }}</dd>
            </div>
            <div class="flex justify-between border-t border-slate-100 pt-3 text-base font-semibold text-slate-900">
              <dt>Subtotal</dt>
              <dd>{{ formatCurrency(cartStore.total) }}</dd>
            </div>
          </dl>

          <RouterLink to="/checkout" class="btn-primary mt-6 w-full">
            Proceed to checkout
          </RouterLink>
        </div>
      </aside>
    </div>
  </div>
</template>
