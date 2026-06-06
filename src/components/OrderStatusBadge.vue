<script setup lang="ts">
import type { OrderStatus } from '@/types/api'

const props = defineProps<{
  status: OrderStatus
}>()

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 ring-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 ring-blue-200',
  shipped: 'bg-indigo-100 text-indigo-800 ring-indigo-200',
  delivered: 'bg-green-100 text-green-800 ring-green-200',
  cancelled: 'bg-red-100 text-red-800 ring-red-200',
}

const badgeClass = STATUS_STYLES[props.status]
</script>

<template>
  <span
    class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset"
    :class="badgeClass"
  >
    {{ status }}
  </span>
</template>
