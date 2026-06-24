<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'
import { onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const SEARCH_DEBOUNCE_MS = 300
const inputValue = ref(props.modelValue)
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function clearDebounceTimer(): void {
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
}

function scheduleSearchEmit(value: string): void {
  clearDebounceTimer()
  debounceTimer = setTimeout(() => {
    emit('update:modelValue', value)
  }, SEARCH_DEBOUNCE_MS)
}

function handleInput(event: Event): void {
  const nextValue = (event.target as HTMLInputElement).value
  inputValue.value = nextValue
  scheduleSearchEmit(nextValue)
}

function handleClear(): void {
  inputValue.value = ''
  clearDebounceTimer()
  emit('update:modelValue', '')
}

watch(
  () => props.modelValue,
  (nextValue) => {
    if (nextValue !== inputValue.value) {
      inputValue.value = nextValue
    }
  },
)

onBeforeUnmount(() => {
  clearDebounceTimer()
})
</script>

<template>
  <div class="relative w-full sm:max-w-xs">
    <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    <input
      type="search"
      :value="inputValue"
      placeholder="Search products..."
      aria-label="Search products"
      class="input-field w-full pl-10 pr-10"
      @input="handleInput"
    />
    <button
      v-if="inputValue !== ''"
      type="button"
      class="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
      aria-label="Clear search"
      @click="handleClear"
    >
      <X class="h-4 w-4" />
    </button>
  </div>
</template>
