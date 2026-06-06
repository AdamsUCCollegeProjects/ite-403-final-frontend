<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    fullWidth?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    disabled: false,
    fullWidth: false,
  },
)

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
}

const buttonClass = computed(() => {
  const classes = [VARIANT_CLASSES[props.variant]]

  if (props.size === 'sm') {
    classes.push('btn-sm')
  }

  if (props.fullWidth) {
    classes.push('w-full')
  }

  return classes.join(' ')
})
</script>

<template>
  <button :type="type" :class="buttonClass" :disabled="disabled">
    <slot />
  </button>
</template>
