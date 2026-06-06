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
    <label :for="name" class="mb-1.5 block text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="name"
      :name="name"
      :type="type ?? 'text'"
      :value="modelValue"
      :aria-invalid="Boolean(error)"
      class="input-field"
      :class="{ 'input-field-error': error }"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="mt-1.5 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
