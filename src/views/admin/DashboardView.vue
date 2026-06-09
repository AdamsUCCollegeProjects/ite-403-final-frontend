<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { DollarSign, Package, ShoppingBag, Users } from 'lucide-vue-next'

import * as adminApi from '@/api/admin'
import { ApiClientError } from '@/api/client'
import EmptyState from '@/components/EmptyState.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import LoadingState from '@/components/LoadingState.vue'
import OrderStatusBadge from '@/components/OrderStatusBadge.vue'
import PageHeader from '@/components/PageHeader.vue'
import StatCard from '@/components/StatCard.vue'
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
    <PageHeader title="Dashboard" subtitle="Overview of your store performance" />

    <LoadingState v-if="isLoading" message="Loading dashboard..." />
    <ErrorAlert v-else-if="errorMessage" :message="errorMessage" />

    <template v-else-if="dashboard">
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total orders"
          :value="dashboard.total_orders"
          :icon="ShoppingBag"
          icon-bg-class="bg-brand-100"
          icon-color-class="text-brand-700"
        />
        <StatCard
          label="Total revenue"
          :value="formatCurrency(dashboard.total_revenue)"
          :icon="DollarSign"
          icon-bg-class="bg-emerald-100"
          icon-color-class="text-emerald-600"
        />
        <StatCard
          label="Total users"
          :value="dashboard.total_users"
          :icon="Users"
          icon-bg-class="bg-brand-200"
          icon-color-class="text-brand-800"
        />
        <StatCard
          label="Total products"
          :value="dashboard.total_products"
          :icon="Package"
          icon-bg-class="bg-amber-100"
          icon-color-class="text-amber-600"
        />
      </div>

      <div class="mt-8">
        <h3 class="mb-4 text-lg font-semibold text-slate-900">Recent orders</h3>

        <EmptyState
          v-if="dashboard.recent_orders.length === 0"
          message="No orders yet."
        />

        <div v-else class="table-container">
          <table class="min-w-full text-left text-sm">
            <thead class="table-header sticky top-0">
              <tr>
                <th class="px-4 py-3 font-semibold text-slate-700">Order</th>
                <th class="px-4 py-3 font-semibold text-slate-700">Customer</th>
                <th class="px-4 py-3 font-semibold text-slate-700">Date</th>
                <th class="px-4 py-3 font-semibold text-slate-700">Status</th>
                <th class="px-4 py-3 font-semibold text-slate-700">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in dashboard.recent_orders"
                :key="order.id"
                class="table-row"
              >
                <td class="px-4 py-4">
                  <RouterLink
                    :to="{ name: 'admin-order-detail', params: { id: order.id } }"
                    class="link-brand"
                  >
                    #{{ order.id }}
                  </RouterLink>
                </td>
                <td class="px-4 py-4 text-muted-foreground">{{ order.shipping_name }}</td>
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
  </div>
</template>
