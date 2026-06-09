<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import * as adminApi from '@/api/admin'
import { ApiClientError } from '@/api/client'
import Button from '@/components/Button.vue'
import Card from '@/components/Card.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import LoadingState from '@/components/LoadingState.vue'
import OrderStatusBadge from '@/components/OrderStatusBadge.vue'
import PageHeader from '@/components/PageHeader.vue'
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
      <PageHeader
        :title="`Order #${order.id}`"
        :subtitle="`Placed on ${formatDate(order.created_at)} · User ID ${order.user_id}`"
        :back-to="{ name: 'admin-orders' }"
        back-label="Back to orders"
      />

      <div class="mb-6">
        <OrderStatusBadge :status="order.status" />
      </div>

      <Card class="mb-6 p-5">
        <h3 class="mb-3 font-semibold text-slate-900">Update status</h3>
        <div class="flex flex-wrap items-end gap-3">
          <div>
            <label for="order_status" class="mb-1.5 block text-sm font-medium text-slate-700">
              Status
            </label>
            <select id="order_status" v-model="selectedStatus" class="input-field">
              <option v-for="status in ORDER_STATUSES" :key="status" :value="status">
                {{ status }}
              </option>
            </select>
          </div>
          <Button
            size="sm"
            :disabled="isUpdating || selectedStatus === order.status"
            @click="handleStatusUpdate"
          >
            {{ isUpdating ? 'Updating...' : 'Save status' }}
          </Button>
        </div>
        <ErrorAlert v-if="statusError" class="mt-3" :message="statusError" />
      </Card>

      <div class="grid gap-6 lg:grid-cols-3">
        <Card class="lg:col-span-1 p-5">
          <h3 class="mb-3 font-semibold text-slate-900">Shipping</h3>
          <address class="space-y-1 text-sm not-italic text-slate-700">
            <p class="font-medium">{{ order.shipping_name }}</p>
            <p>{{ order.shipping_address }}</p>
            <p>{{ order.shipping_city }}, {{ order.shipping_postal_code }}</p>
            <p>{{ order.shipping_phone }}</p>
          </address>
        </Card>

        <div class="lg:col-span-2">
          <div class="table-container">
            <table class="min-w-full text-left text-sm">
              <thead class="table-header">
                <tr>
                  <th class="px-4 py-3 font-semibold text-slate-700">Product</th>
                  <th class="px-4 py-3 font-semibold text-slate-700">Price</th>
                  <th class="px-4 py-3 font-semibold text-slate-700">Qty</th>
                  <th class="px-4 py-3 font-semibold text-slate-700">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in order.items" :key="item.id" class="table-row">
                  <td class="px-4 py-4 text-slate-900">{{ item.product_name }}</td>
                  <td class="px-4 py-4 text-muted-foreground">
                    {{ formatCurrency(item.unit_price) }}
                  </td>
                  <td class="px-4 py-4 text-muted-foreground">{{ item.quantity }}</td>
                  <td class="px-4 py-4 font-semibold text-slate-900">
                    {{ formatCurrency(item.line_total) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="mt-4 text-right text-lg font-bold text-slate-900">
            Total: {{ formatCurrency(order.total) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
