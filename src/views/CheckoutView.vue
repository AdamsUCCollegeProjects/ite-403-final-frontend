<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { CreditCard, Loader2, PackageCheck } from 'lucide-vue-next'

import * as ordersApi from '@/api/orders'
import { ApiClientError } from '@/api/client'
import Button from '@/components/Button.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import FormField from '@/components/FormField.vue'
import LoadingState from '@/components/LoadingState.vue'
import PageHeader from '@/components/PageHeader.vue'
import PayWayCheckoutFrame from '@/components/PayWayCheckoutFrame.vue'
import { useCartStore } from '@/stores/cart'
import type { CheckoutResponse } from '@/types/api'
import { formatCurrency } from '@/utils/format'

type CheckoutStep = 'shipping' | 'payment'

const cartStore = useCartStore()

const checkoutStep = ref<CheckoutStep>('shipping')
const checkoutResult = ref<CheckoutResponse | null>(null)

const shippingName = ref('')
const shippingAddress = ref('')
const shippingCity = ref('')
const shippingPostalCode = ref('')
const shippingPhone = ref('')
const errorMessage = ref('')
const fieldErrors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

async function loadCart(): Promise<void> {
  await cartStore.fetchCart()
}

async function handleSubmit(): Promise<void> {
  errorMessage.value = ''
  fieldErrors.value = {}
  isSubmitting.value = true

  try {
    const result = await ordersApi.checkout({
      shipping_name: shippingName.value,
      shipping_address: shippingAddress.value,
      shipping_city: shippingCity.value,
      shipping_postal_code: shippingPostalCode.value,
      shipping_phone: shippingPhone.value,
    })

    await cartStore.fetchCart()
    checkoutResult.value = result
    checkoutStep.value = 'payment'
  } catch (error) {
    if (error instanceof ApiClientError) {
      errorMessage.value = error.message
      fieldErrors.value = error.fieldErrors ?? {}
      return
    }

    errorMessage.value = 'Checkout failed'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  void loadCart()
})
</script>

<template>
  <div>
    <PageHeader
      :title="checkoutStep === 'shipping' ? 'Checkout' : 'Complete payment'"
      :subtitle="
        checkoutStep === 'shipping'
          ? 'Enter your shipping details to complete your order'
          : 'Pay with ABA KHQR to confirm your order'
      "
    />

    <LoadingState v-if="cartStore.isLoading && checkoutStep === 'shipping'" />

    <EmptyState
      v-else-if="checkoutStep === 'shipping' && cartStore.items.length === 0"
      message="Your cart is empty."
      action-label="Continue shopping"
      action-to="/"
    />

    <div v-else-if="checkoutStep === 'shipping'" class="grid gap-8 lg:grid-cols-3">
      <div class="lg:col-span-2">
        <div class="card p-6">
          <ErrorAlert v-if="errorMessage" class="mb-6" :message="errorMessage" />

          <form class="space-y-4" @submit.prevent="handleSubmit">
            <FormField
              v-model="shippingName"
              label="Full name"
              name="shipping_name"
              required
              :error="fieldErrors.shipping_name"
            />
            <FormField
              v-model="shippingAddress"
              label="Address"
              name="shipping_address"
              required
              :error="fieldErrors.shipping_address"
            />
            <FormField
              v-model="shippingCity"
              label="City"
              name="shipping_city"
              required
              :error="fieldErrors.shipping_city"
            />
            <FormField
              v-model="shippingPostalCode"
              label="Postal code"
              name="shipping_postal_code"
              required
              :error="fieldErrors.shipping_postal_code"
            />
            <FormField
              v-model="shippingPhone"
              label="Phone"
              name="shipping_phone"
              type="tel"
              required
              :error="fieldErrors.shipping_phone"
            />

            <Button type="submit" full-width :disabled="isSubmitting">
              <Loader2 v-if="isSubmitting" class="h-4 w-4 animate-spin" />
              <PackageCheck v-else class="h-4 w-4" />
              {{ isSubmitting ? 'Placing order...' : 'Continue to payment' }}
            </Button>
          </form>
        </div>
      </div>

      <aside class="lg:col-span-1">
        <div class="card sticky top-24 p-6">
          <h2 class="text-lg font-semibold text-slate-900">Order summary</h2>

          <ul class="mt-4 space-y-3 border-b border-slate-100 pb-4">
            <li
              v-for="item in cartStore.items"
              :key="item.id"
              class="flex justify-between text-sm"
            >
              <span class="text-muted-foreground">
                {{ item.product_name }}
                <span class="text-slate-400">× {{ item.quantity }}</span>
              </span>
              <span class="font-medium text-slate-900">{{ formatCurrency(item.line_total) }}</span>
            </li>
          </ul>

          <div class="mt-4 flex justify-between text-base font-semibold text-slate-900">
            <span>Total</span>
            <span>{{ formatCurrency(cartStore.total) }}</span>
          </div>
        </div>
      </aside>
    </div>

    <div v-else-if="checkoutResult" class="grid gap-8 lg:grid-cols-3">
      <div class="lg:col-span-2 space-y-6">
        <div class="card p-6">
          <div class="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 class="h-4 w-4 animate-spin text-brand-600" />
            Waiting for payment…
          </div>

          <div class="mb-4 flex items-center gap-2">
            <CreditCard class="h-5 w-5 text-brand-600" />
            <h2 class="text-lg font-semibold text-slate-900">ABA KHQR payment</h2>
          </div>

          <p class="mb-4 text-sm text-muted-foreground">
            Order #{{ checkoutResult.id }} has been created. Complete payment below to confirm your
            order.
          </p>

          <PayWayCheckoutFrame :checkout-html="checkoutResult.checkout_html" />
        </div>
      </div>

      <aside class="lg:col-span-1">
        <div class="card sticky top-24 p-6">
          <h2 class="text-lg font-semibold text-slate-900">Order summary</h2>
          <p class="mt-1 text-sm text-muted-foreground">Order #{{ checkoutResult.id }}</p>

          <ul class="mt-4 space-y-3 border-b border-slate-100 pb-4">
            <li
              v-for="item in checkoutResult.items"
              :key="item.id"
              class="flex justify-between text-sm"
            >
              <span class="text-muted-foreground">
                {{ item.product_name }}
                <span class="text-slate-400">× {{ item.quantity }}</span>
              </span>
              <span class="font-medium text-slate-900">{{ formatCurrency(item.line_total) }}</span>
            </li>
          </ul>

          <div class="mt-4 flex justify-between text-base font-semibold text-slate-900">
            <span>Total</span>
            <span>{{ formatCurrency(checkoutResult.total) }}</span>
          </div>

          <address class="mt-4 space-y-1 border-t border-slate-100 pt-4 text-sm not-italic text-slate-700">
            <p class="font-medium text-slate-900">Ship to</p>
            <p>{{ checkoutResult.shipping_name }}</p>
            <p>{{ checkoutResult.shipping_address }}</p>
            <p>{{ checkoutResult.shipping_city }}, {{ checkoutResult.shipping_postal_code }}</p>
            <p>{{ checkoutResult.shipping_phone }}</p>
          </address>
        </div>
      </aside>
    </div>
  </div>
</template>
