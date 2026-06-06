<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import * as adminApi from '@/api/admin'
import { ApiClientError } from '@/api/client'
import EmptyState from '@/components/EmptyState.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import LoadingState from '@/components/LoadingState.vue'
import OrderStatusBadge from '@/components/OrderStatusBadge.vue'
import type { AdminDashboard } from '@/types/api'
import { formatCurrency } from '@/utils/format'

const dashboard = ref<AdminDashboard | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')

async function loadDashboard(): Promise<void> {
  isLoading.value = true
  errorMessage.value = ''

  try {
    dashboard.value = await adminApi.getDashboard()
  } catch (error) {
    errorMessage.value =
      error instanceof ApiClientError ? error.message : 'Failed to load dashboard'
  } finally {
    isLoading.value = false
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString()
}

onMounted(() => {
  void loadDashboard()
})
</script>

<template>
  <div>
    <h2 class="mb-6 text-2xl font-bold text-gray-900">Dashboard</h2>

    <LoadingState v-if="isLoading" message="Loading dashboard..." />
    <ErrorAlert v-else-if="errorMessage" :message="errorMessage" />

    <template v-else-if="dashboard">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-lg border border-gray-200 bg-white p-4">
          <p class="text-sm text-gray-500">Total orders</p>
          <p class="mt-1 text-2xl font-bold text-gray-900">{{ dashboard.total_orders }}</p>
        </div>
        <div class="rounded-lg border border-gray-200 bg-white p-4">
          <p class="text-sm text-gray-500">Total revenue</p>
          <p class="mt-1 text-2xl font-bold text-gray-900">
            {{ formatCurrency(dashboard.total_revenue) }}
          </p>
        </div>
        <div class="rounded-lg border border-gray-200 bg-white p-4">
          <p class="text-sm text-gray-500">Total users</p>
          <p class="mt-1 text-2xl font-bold text-gray-900">{{ dashboard.total_users }}</p>
        </div>
        <div class="rounded-lg border border-gray-200 bg-white p-4">
          <p class="text-sm text-gray-500">Total products</p>
          <p class="mt-1 text-2xl font-bold text-gray-900">{{ dashboard.total_products }}</p>
        </div>
      </div>

      <div class="mt-8">
        <h3 class="mb-4 text-lg font-semibold text-gray-900">Recent orders</h3>

        <EmptyState
          v-if="dashboard.recent_orders.length === 0"
          message="No orders yet."
        />

        <div v-else class="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table class="min-w-full text-left text-sm">
            <thead class="border-b border-gray-200 bg-gray-50">
              <tr>
                <th class="px-4 py-3 font-medium text-gray-700">Order</th>
                <th class="px-4 py-3 font-medium text-gray-700">Customer</th>
                <th class="px-4 py-3 font-medium text-gray-700">Date</th>
                <th class="px-4 py-3 font-medium text-gray-700">Status</th>
                <th class="px-4 py-3 font-medium text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in dashboard.recent_orders"
                :key="order.id"
                class="border-b border-gray-200 hover:bg-gray-50"
              >
                <td class="px-4 py-3">
                  <RouterLink
                    :to="{ name: 'admin-order-detail', params: { id: order.id } }"
                    class="font-medium text-blue-600 hover:underline"
                  >
                    #{{ order.id }}
                  </RouterLink>
                </td>
                <td class="px-4 py-3 text-gray-600">{{ order.shipping_name }}</td>
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
  </div>
</template>
