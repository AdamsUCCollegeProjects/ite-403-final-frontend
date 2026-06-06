<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import * as adminApi from '@/api/admin'
import { ApiClientError } from '@/api/client'
import ErrorAlert from '@/components/ErrorAlert.vue'
import LoadingState from '@/components/LoadingState.vue'
import OrderStatusBadge from '@/components/OrderStatusBadge.vue'
import type { AdminOrderDetail, OrderStatus } from '@/types/api'
import { formatCurrency } from '@/utils/format'

const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
]

const route = useRoute()

const order = ref<AdminOrderDetail | null>(null)
const selectedStatus = ref<OrderStatus>('pending')
const isLoading = ref(true)
const isUpdating = ref(false)
const errorMessage = ref('')
const statusError = ref('')

const orderId = computed(() => Number.parseInt(route.params.id as string, 10))

async function loadOrder(): Promise<void> {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const orderDetail = await adminApi.getAdminOrder(orderId.value)
    order.value = orderDetail
    selectedStatus.value = orderDetail.status
  } catch (error) {
    errorMessage.value =
      error instanceof ApiClientError ? error.message : 'Failed to load order'
  } finally {
    isLoading.value = false
  }
}

async function handleStatusUpdate(): Promise<void> {
  if (!order.value) {
    return
  }

  statusError.value = ''
  isUpdating.value = true

  try {
    order.value = await adminApi.updateOrderStatus(order.value.id, selectedStatus.value)
    selectedStatus.value = order.value.status
  } catch (error) {
    statusError.value =
      error instanceof ApiClientError ? error.message : 'Failed to update status'
  } finally {
    isUpdating.value = false
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

    <div v-else-if="order">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 class="text-2xl font-bold text-gray-900">Order #{{ order.id }}</h2>
        <OrderStatusBadge :status="order.status" />
      </div>

      <p class="text-sm text-gray-500">Placed on {{ formatDate(order.created_at) }}</p>
      <p class="mt-1 text-sm text-gray-500">User ID: {{ order.user_id }}</p>

      <div class="mt-4 flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label for="order_status" class="mb-1 block text-sm font-medium text-gray-700">
            Update status
          </label>
          <select
            id="order_status"
            v-model="selectedStatus"
            class="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option v-for="status in ORDER_STATUSES" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
        </div>
        <button
          type="button"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          :disabled="isUpdating || selectedStatus === order.status"
          @click="handleStatusUpdate"
        >
          {{ isUpdating ? 'Updating...' : 'Save status' }}
        </button>
      </div>
      <ErrorAlert v-if="statusError" class="mt-3" :message="statusError" />

      <div class="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <h3 class="mb-3 font-semibold text-gray-900">Shipping</h3>
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
