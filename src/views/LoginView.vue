<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ErrorAlert from '@/components/ErrorAlert.vue'
import FormField from '@/components/FormField.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const fieldErrors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

function getRedirectPath(): string {
  if (authStore.isAdmin) {
    return '/admin'
  }

  const redirect = route.query.redirect

  if (typeof redirect === 'string' && redirect.startsWith('/')) {
    return redirect
  }

  return '/'
}

async function handleSubmit(): Promise<void> {
  errorMessage.value = ''
  fieldErrors.value = {}
  isSubmitting.value = true

  try {
    await authStore.login({ email: email.value, password: password.value })
    await router.push(getRedirectPath())
  } catch (error) {
    errorMessage.value = authStore.getErrorMessage(error)
    fieldErrors.value = authStore.getFieldErrors(error) ?? {}
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-md">
    <h1 class="mb-6 text-2xl font-bold text-gray-900">Login</h1>

    <ErrorAlert v-if="errorMessage" class="mb-4" :message="errorMessage" />

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <FormField
        v-model="email"
        label="Email"
        name="email"
        type="email"
        required
        :error="fieldErrors.email"
      />
      <FormField
        v-model="password"
        label="Password"
        name="password"
        type="password"
        required
        :error="fieldErrors.password"
      />

      <button
        type="submit"
        class="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
      </button>
    </form>

    <p class="mt-4 text-center text-sm text-gray-600">
      No account?
      <RouterLink to="/register" class="text-blue-600 hover:underline">Register</RouterLink>
    </p>
  </div>
</template>
