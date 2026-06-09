<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { CheckCircle, Circle, Clock, Package, Truck } from 'lucide-vue-next'

import * as ordersApi from '@/api/orders'
import { ApiClientError } from '@/api/client'
import ErrorAlert from '@/components/ErrorAlert.vue'
import LoadingState from '@/components/LoadingState.vue'
import OrderStatusBadge from '@/components/OrderStatusBadge.vue'
import PageHeader from '@/components/PageHeader.vue'
import type { OrderDetail, OrderStatus } from '@/types/api'
import { formatCurrency } from '@/utils/format'

const STATUS_STEPS: OrderStatus[] = ['pending', 'confirmed', 'shipped', 'delivered']

const route = useRoute()

const order = ref<OrderDetail | null>(null)
const isLoading = ref(true)
const errorMessage = ref('')

const orderId = computed(() => Number.parseInt(route.params.id as string, 10))

const showPaymentSuccess = computed(() => route.query.paid === '1')

const isAwaitingPayment = computed(
  () => order.value?.status === 'pending' && order.value?.payment_status === 'awaiting',
)

const currentStepIndex = computed(() => {
  if (!order.value) {
    return -1
  }

  if (order.value.status === 'cancelled') {
    return -1
  }

  if (isAwaitingPayment.value) {
    return 0
  }

  return STATUS_STEPS.indexOf(order.value.status)
})

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

function isStepComplete(index: number): boolean {
  if (isAwaitingPayment.value) {
    return false
  }

  return currentStepIndex.value > index
}

function isStepActive(index: number): boolean {
  return currentStepIndex.value === index
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
        :subtitle="`Placed on ${formatDate(order.created_at)}`"
        back-to="/orders"
        back-label="Back to orders"
      />

      <div v-if="showPaymentSuccess" class="success-banner mb-6 flex items-center gap-2">
        <CheckCircle class="h-4 w-4 shrink-0" />
        Payment received. Your order is being confirmed.
      </div>

      <div
        v-else-if="isAwaitingPayment"
        class="mb-6 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
      >
        <Clock class="h-4 w-4 shrink-0" />
        Payment pending — complete payment to confirm this order.
      </div>

      <div class="mb-6 flex items-center gap-3">
        <OrderStatusBadge :status="order.status" />
      </div>

      <div v-if="order.status !== 'cancelled'" class="card mb-8 p-6">
        <h2 class="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Order progress
        </h2>
        <div class="flex items-center justify-between">
          <div
            v-for="(step, index) in STATUS_STEPS"
            :key="step"
            class="flex flex-1 flex-col items-center"
          >
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full"
              :class="
                isStepComplete(index)
                  ? 'bg-brand-600 text-white'
                  : isStepActive(index)
                    ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-300'
                    : 'bg-slate-100 text-slate-400'
              "
            >
              <CheckCircle v-if="isStepComplete(index)" class="h-5 w-5" />
              <Clock v-else-if="isStepActive(index) && isAwaitingPayment" class="h-5 w-5" />
              <Package v-else-if="step === 'pending'" class="h-5 w-5" />
              <Circle v-else-if="step === 'confirmed'" class="h-5 w-5" />
              <Truck v-else class="h-5 w-5" />
            </div>
            <span
              class="mt-2 text-xs font-medium capitalize"
              :class="
                isStepComplete(index)
                  ? 'text-brand-600'
                  : isStepActive(index)
                    ? 'text-amber-700'
                    : 'text-muted-foreground'
              "
            >
              {{ isAwaitingPayment && step === 'pending' ? 'awaiting payment' : step }}
            </span>
          </div>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <div class="card p-6 lg:col-span-1">
          <h2 class="mb-3 font-semibold text-slate-900">Shipping</h2>
          <address class="space-y-1 text-sm not-italic text-slate-700">
            <p class="font-medium">{{ order.shipping_name }}</p>
            <p>{{ order.shipping_address }}</p>
            <p>{{ order.shipping_city }}, {{ order.shipping_postal_code }}</p>
            <p>{{ order.shipping_phone }}</p>
          </address>
        </div>

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
