<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AuthBrandPanel from '@/components/AuthBrandPanel.vue'
import Button from '@/components/Button.vue'
import Card from '@/components/Card.vue'
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

function getRoleToggleClass(isActive: boolean): string {
  if (isActive) {
    return 'bg-brand-600 text-white shadow-sm'
  }

  return 'text-muted-foreground hover:text-slate-900'
}

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
  <div class="flex min-h-[calc(100vh-4.5rem)] items-stretch">
    <AuthBrandPanel />

    <div class="flex flex-1 items-center justify-center px-4 py-10 lg:px-12">
      <Card class="w-full max-w-md">
        <h1 class="text-2xl font-bold text-slate-900">Create account</h1>
        <p class="mt-1 text-sm text-muted-foreground">Join Boutique and start shopping</p>

        <div class="mt-6 flex rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            class="flex-1 rounded-md px-3 py-2 text-sm font-medium transition"
            :class="getRoleToggleClass(role === 'customer')"
            @click="role = 'customer'"
          >
            Customer
          </button>
          <button
            type="button"
            class="flex-1 rounded-md px-3 py-2 text-sm font-medium transition"
            :class="getRoleToggleClass(role === 'admin')"
            @click="role = 'admin'"
          >
            Admin
          </button>
        </div>

        <ErrorAlert v-if="errorMessage" class="mt-6" :message="errorMessage" />

        <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
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

          <Button type="submit" full-width :disabled="isSubmitting">
            {{ isSubmitting ? 'Creating account...' : 'Create account' }}
          </Button>
        </form>

        <p class="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?
          <RouterLink to="/login" class="link-brand">Login</RouterLink>
        </p>
      </Card>
    </div>
  </div>
</template>
