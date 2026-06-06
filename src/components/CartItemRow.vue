<script setup lang="ts">
import { ref, watch } from 'vue'
import { Trash2 } from 'lucide-vue-next'

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
  <tr class="table-row">
    <td class="px-4 py-4 font-medium text-slate-900">{{ item.product_name }}</td>
    <td class="px-4 py-4 text-muted-foreground">{{ formatCurrency(item.unit_price) }}</td>
    <td class="px-4 py-4">
      <input
        v-model.number="localQuantity"
        type="number"
        min="1"
        class="input-field w-20"
        :disabled="isUpdating"
        @change="handleQuantityChange"
      />
    </td>
    <td class="px-4 py-4 font-semibold text-slate-900">{{ formatCurrency(item.line_total) }}</td>
    <td class="px-4 py-4">
      <button
        type="button"
        class="btn-ghost btn-sm text-red-600 hover:bg-red-50 hover:text-red-700"
        :disabled="isUpdating"
        aria-label="Remove item"
        @click="handleRemove"
      >
        <Trash2 class="h-4 w-4" />
      </button>
    </td>
  </tr>
</template>
