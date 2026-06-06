<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Loader2, PackageCheck } from 'lucide-vue-next'

import * as ordersApi from '@/api/orders'
import { ApiClientError } from '@/api/client'
import Button from '@/components/Button.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import FormField from '@/components/FormField.vue'
import LoadingState from '@/components/LoadingState.vue'
import PageHeader from '@/components/PageHeader.vue'
import { useCartStore } from '@/stores/cart'
import { formatCurrency } from '@/utils/format'

const cartStore = useCartStore()
const router = useRouter()

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
    const order = await ordersApi.checkout({
      shipping_name: shippingName.value,
      shipping_address: shippingAddress.value,
      shipping_city: shippingCity.value,
      shipping_postal_code: shippingPostalCode.value,
      shipping_phone: shippingPhone.value,
    })

    await cartStore.fetchCart()
    await router.push({ name: 'order-detail', params: { id: order.id } })
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
    <PageHeader title="Checkout" subtitle="Enter your shipping details to complete your order" />

    <LoadingState v-if="cartStore.isLoading" />

    <EmptyState
      v-else-if="cartStore.items.length === 0"
      message="Your cart is empty."
      action-label="Continue shopping"
      action-to="/"
    />

    <div v-else class="grid gap-8 lg:grid-cols-3">
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
              {{ isSubmitting ? 'Placing order...' : 'Place order' }}
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
  </div>
</template>
