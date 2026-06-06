<script setup lang="ts">
defineProps<{
  label: string
  name: string
  type?: string
  modelValue: string
  error?: string
  required?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div>
    <label :for="name" class="mb-1 block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="name"
      :name="name"
      :type="type ?? 'text'"
      :value="modelValue"
      :aria-invalid="Boolean(error)"
      class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      :class="{ 'border-red-500': error }"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
