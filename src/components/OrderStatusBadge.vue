<script setup lang="ts">
import type { OrderStatus } from '@/types/api'

const props = defineProps<{
  status: OrderStatus
}>()

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const badgeClass = STATUS_STYLES[props.status]
</script>

<template>
  <span
    class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
    :class="badgeClass"
  >
    {{ status }}
  </span>
</template>
