<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import * as ordersApi from '@/api/orders'
import { ApiClientError } from '@/api/client'
import ErrorAlert from '@/components/ErrorAlert.vue'
import LoadingState from '@/components/LoadingState.vue'
import OrderStatusBadge from '@/components/OrderStatusBadge.vue'
import type { OrderDetail } from '@/types/api'
import { formatCurrency } from '@/utils/format'

const route = useRoute()

const order = ref<OrderDetail | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')

const orderId = computed(() => Number.parseInt(route.params.id as string, 10))

async function loadOrder(): Promise<void> {
  isLoading.value = true
  errorMessage.value = ''

  try {
    order.value = await ordersApi.getOrder(orderId.value)
  } catch (error) {
    errorMessage.value =
      error instanceof ApiClientError ? error.message : 'Failed to load order'
  } finally {
    isLoading.value = false
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString()
}

onMounted(() => {
  void loadOrder()
})
</script>

<template>
  <div>
    <LoadingState v-if="isLoading" message="Loading order..." />
    <ErrorAlert v-else-if="errorMessage" :message="errorMessage" />

    <div v-else-if="order" class="max-w-3xl">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Order #{{ order.id }}</h1>
        <OrderStatusBadge :status="order.status" />
      </div>

      <p class="text-sm text-gray-500">Placed on {{ formatDate(order.created_at) }}</p>

      <div class="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <h2 class="mb-3 font-semibold text-gray-900">Shipping</h2>
        <p class="text-sm text-gray-700">{{ order.shipping_name }}</p>
        <p class="text-sm text-gray-700">{{ order.shipping_address }}</p>
        <p class="text-sm text-gray-700">
          {{ order.shipping_city }}, {{ order.shipping_postal_code }}
        </p>
        <p class="text-sm text-gray-700">{{ order.shipping_phone }}</p>
      </div>

      <div class="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table class="min-w-full text-left text-sm">
          <thead class="border-b border-gray-200 bg-gray-50">
            <tr>
              <th class="px-4 py-3 font-medium text-gray-700">Product</th>
              <th class="px-4 py-3 font-medium text-gray-700">Price</th>
              <th class="px-4 py-3 font-medium text-gray-700">Qty</th>
              <th class="px-4 py-3 font-medium text-gray-700">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in order.items"
              :key="item.id"
              class="border-b border-gray-200"
            >
              <td class="px-4 py-3 text-gray-900">{{ item.product_name }}</td>
              <td class="px-4 py-3 text-gray-600">{{ formatCurrency(item.unit_price) }}</td>
              <td class="px-4 py-3 text-gray-600">{{ item.quantity }}</td>
              <td class="px-4 py-3 font-medium text-gray-900">
                {{ formatCurrency(item.line_total) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="mt-4 text-right text-lg font-semibold text-gray-900">
        Total: {{ formatCurrency(order.total) }}
      </p>
    </div>
  </div>
</template>
