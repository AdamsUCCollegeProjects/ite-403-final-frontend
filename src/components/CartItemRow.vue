<script setup lang="ts">
import { ref, watch } from 'vue'

import type { CartItem } from '@/types/api'
import { formatCurrency } from '@/utils/format'

const props = defineProps<{
  item: CartItem
  isUpdating?: boolean
}>()

const emit = defineEmits<{
  updateQuantity: [quantity: number]
  remove: []
}>()

const localQuantity = ref(props.item.quantity)

watch(
  () => props.item.quantity,
  (quantity) => {
    localQuantity.value = quantity
  },
)

function handleQuantityChange(): void {
  const quantity = Math.max(1, localQuantity.value)

  if (quantity === props.item.quantity) {
    return
  }

  emit('updateQuantity', quantity)
}

function handleRemove(): void {
  emit('remove')
}
</script>

<template>
  <tr class="border-b border-gray-200">
    <td class="px-4 py-3 font-medium text-gray-900">{{ item.product_name }}</td>
    <td class="px-4 py-3 text-gray-600">{{ formatCurrency(item.unit_price) }}</td>
    <td class="px-4 py-3">
      <input
        v-model.number="localQuantity"
        type="number"
        min="1"
        class="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
        :disabled="isUpdating"
        @change="handleQuantityChange"
      />
    </td>
    <td class="px-4 py-3 font-medium text-gray-900">{{ formatCurrency(item.line_total) }}</td>
    <td class="px-4 py-3">
      <button
        type="button"
        class="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
        :disabled="isUpdating"
        @click="handleRemove"
      >
        Remove
      </button>
    </td>
  </tr>
</template>
