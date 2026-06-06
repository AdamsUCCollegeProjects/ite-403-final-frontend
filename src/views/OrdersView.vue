<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import * as ordersApi from '@/api/orders'
import { ApiClientError } from '@/api/client'
import EmptyState from '@/components/EmptyState.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import LoadingState from '@/components/LoadingState.vue'
import OrderStatusBadge from '@/components/OrderStatusBadge.vue'
import PageHeader from '@/components/PageHeader.vue'
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
    <PageHeader title="Order History" subtitle="Track your past purchases" />

    <LoadingState v-if="isLoading" message="Loading orders..." />
    <ErrorAlert v-else-if="errorMessage" :message="errorMessage" />

    <EmptyState
      v-else-if="orders.length === 0"
      message="No orders yet."
      action-label="Browse products"
      action-to="/"
    />

    <div v-else class="table-container">
      <table class="min-w-full text-left text-sm">
        <thead class="table-header">
          <tr>
            <th class="px-4 py-3 font-semibold text-slate-700">Order</th>
            <th class="px-4 py-3 font-semibold text-slate-700">Date</th>
            <th class="px-4 py-3 font-semibold text-slate-700">Status</th>
            <th class="px-4 py-3 font-semibold text-slate-700">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id" class="table-row">
            <td class="px-4 py-4">
              <RouterLink
                :to="{ name: 'order-detail', params: { id: order.id } }"
                class="link-brand"
              >
                #{{ order.id }}
              </RouterLink>
            </td>
            <td class="px-4 py-4 text-muted-foreground">{{ formatDate(order.created_at) }}</td>
            <td class="px-4 py-4">
              <OrderStatusBadge :status="order.status" />
            </td>
            <td class="px-4 py-4 font-semibold text-slate-900">
              {{ formatCurrency(order.total) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
