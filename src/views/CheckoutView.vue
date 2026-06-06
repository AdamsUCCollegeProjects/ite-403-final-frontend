<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import * as ordersApi from '@/api/orders'
import { ApiClientError } from '@/api/client'
import ErrorAlert from '@/components/ErrorAlert.vue'
import FormField from '@/components/FormField.vue'
import LoadingState from '@/components/LoadingState.vue'
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
  <div class="mx-auto max-w-lg">
    <h1 class="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>

    <LoadingState v-if="cartStore.isLoading" />

    <div v-else-if="cartStore.items.length === 0" class="py-12 text-center text-gray-500">
      Your cart is empty.
    </div>

    <template v-else>
      <p class="mb-6 text-gray-600">
        Order total: <span class="font-semibold">{{ formatCurrency(cartStore.total) }}</span>
      </p>

      <ErrorAlert v-if="errorMessage" class="mb-4" :message="errorMessage" />

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

        <button
          type="submit"
          class="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? 'Placing order...' : 'Place order' }}
        </button>
      </form>
    </template>
  </div>
</template>
