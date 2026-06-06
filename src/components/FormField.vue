<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  label: string
  name: string
  type?: string
  modelValue: string
  error?: string
  required?: boolean
  icon?: Component
  placeholder?: string
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
    <div class="relative">
      <component
        :is="icon"
        v-if="icon"
        class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
      />
      <input
        :id="name"
        :name="name"
        :type="type ?? 'text'"
        :value="modelValue"
        :placeholder="placeholder"
        :aria-invalid="Boolean(error)"
        class="input-field"
        :class="[icon ? 'pl-10' : '', error ? 'input-field-error' : '']"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <p v-if="error" class="mt-1.5 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
