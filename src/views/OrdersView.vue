<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import * as ordersApi from '@/api/orders'
import { ApiClientError } from '@/api/client'
import ErrorAlert from '@/components/ErrorAlert.vue'
import LoadingState from '@/components/LoadingState.vue'
import OrderStatusBadge from '@/components/OrderStatusBadge.vue'
import type { OrderSummary } from '@/types/api'
import { formatCurrency } from '@/utils/format'

const orders = ref<OrderSummary[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

async function loadOrders(): Promise<void> {
  isLoading.value = true
  errorMessage.value = ''

  try {
    orders.value = await ordersApi.getOrders()
  } catch (error) {
    errorMessage.value =
      error instanceof ApiClientError ? error.message : 'Failed to load orders'
  } finally {
    isLoading.value = false
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  void loadOrders()
})
</script>

<template>
  <div>
    <h1 class="mb-6 text-2xl font-bold text-gray-900">Order History</h1>

    <LoadingState v-if="isLoading" message="Loading orders..." />
    <ErrorAlert v-else-if="errorMessage" :message="errorMessage" />

    <div v-else-if="orders.length === 0" class="py-12 text-center text-gray-500">
      No orders yet.
    </div>

    <div v-else class="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table class="min-w-full text-left text-sm">
        <thead class="border-b border-gray-200 bg-gray-50">
          <tr>
            <th class="px-4 py-3 font-medium text-gray-700">Order</th>
            <th class="px-4 py-3 font-medium text-gray-700">Date</th>
            <th class="px-4 py-3 font-medium text-gray-700">Status</th>
            <th class="px-4 py-3 font-medium text-gray-700">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="order in orders"
            :key="order.id"
            class="border-b border-gray-200 hover:bg-gray-50"
          >
            <td class="px-4 py-3">
              <RouterLink
                :to="{ name: 'order-detail', params: { id: order.id } }"
                class="font-medium text-blue-600 hover:underline"
              >
                #{{ order.id }}
              </RouterLink>
            </td>
            <td class="px-4 py-3 text-gray-600">{{ formatDate(order.created_at) }}</td>
            <td class="px-4 py-3">
              <OrderStatusBadge :status="order.status" />
            </td>
            <td class="px-4 py-3 font-medium text-gray-900">
              {{ formatCurrency(order.total) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
