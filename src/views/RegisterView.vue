<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import ErrorAlert from '@/components/ErrorAlert.vue'
import FormField from '@/components/FormField.vue'
import { useAuthStore } from '@/stores/auth'

type RegisterRole = 'customer' | 'admin'

const authStore = useAuthStore()
const router = useRouter()

const role = ref<RegisterRole>('customer')
const name = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const fieldErrors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

async function handleSubmit(): Promise<void> {
  errorMessage.value = ''
  fieldErrors.value = {}
  isSubmitting.value = true

  const payload = {
    name: name.value,
    email: email.value,
    password: password.value,
  }

  try {
    if (role.value === 'admin') {
      await authStore.adminRegister(payload)
    } else {
      await authStore.register(payload)
    }

    await router.push('/login')
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
    <h1 class="mb-6 text-2xl font-bold text-gray-900">Register</h1>

    <div class="mb-6 flex rounded-lg border border-gray-200 p-1">
      <button
        type="button"
        class="flex-1 rounded-md px-3 py-2 text-sm font-medium transition"
        :class="role === 'customer' ? 'bg-blue-600 text-white' : 'text-gray-600'"
        @click="role = 'customer'"
      >
        Customer
      </button>
      <button
        type="button"
        class="flex-1 rounded-md px-3 py-2 text-sm font-medium transition"
        :class="role === 'admin' ? 'bg-blue-600 text-white' : 'text-gray-600'"
        @click="role = 'admin'"
      >
        Admin
      </button>
    </div>

    <ErrorAlert v-if="errorMessage" class="mb-4" :message="errorMessage" />

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <FormField
        v-model="name"
        label="Name"
        name="name"
        required
        :error="fieldErrors.name"
      />
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
        {{ isSubmitting ? 'Creating account...' : 'Create account' }}
      </button>
    </form>

    <p class="mt-4 text-center text-sm text-gray-600">
      Already have an account?
      <RouterLink to="/login" class="text-blue-600 hover:underline">Login</RouterLink>
    </p>
  </div>
</template>
