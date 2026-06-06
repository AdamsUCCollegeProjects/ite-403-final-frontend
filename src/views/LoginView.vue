<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AuthBrandPanel from '@/components/AuthBrandPanel.vue'
import Button from '@/components/Button.vue'
import Card from '@/components/Card.vue'
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
  <div class="flex min-h-[calc(100vh-4.5rem)] items-stretch">
    <AuthBrandPanel />

    <div class="flex flex-1 items-center justify-center px-4 py-10 lg:px-12">
      <Card class="w-full max-w-md">
        <h1 class="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p class="mt-1 text-sm text-muted-foreground">Sign in to your account</p>

        <ErrorAlert v-if="errorMessage" class="mt-6" :message="errorMessage" />

        <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
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

          <Button type="submit" full-width :disabled="isSubmitting">
            {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
          </Button>
        </form>

        <p class="mt-6 text-center text-sm text-muted-foreground">
          No account?
          <RouterLink to="/register" class="link-brand">Register</RouterLink>
        </p>
      </Card>
    </div>
  </div>
</template>
