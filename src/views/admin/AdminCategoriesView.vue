<script setup lang="ts">
import { onMounted, ref } from 'vue'

import * as adminApi from '@/api/admin'
import * as categoriesApi from '@/api/categories'
import { ApiClientError } from '@/api/client'
import EmptyState from '@/components/EmptyState.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import FormField from '@/components/FormField.vue'
import LoadingState from '@/components/LoadingState.vue'
import type { Category } from '@/types/api'

const categories = ref<Category[]>([])
const isLoading = ref(true)
const errorMessage = ref('')
const formError = ref('')
const categoryName = ref('')
const editingCategory = ref<Category | null>(null)
const isFormOpen = ref(false)
const isSubmitting = ref(false)
const deletingId = ref<number | null>(null)

function resetForm(): void {
  categoryName.value = ''
  editingCategory.value = null
  isFormOpen.value = false
  formError.value = ''
}

function openCreateForm(): void {
  editingCategory.value = null
  categoryName.value = ''
  formError.value = ''
  isFormOpen.value = true
}

function openEditForm(category: Category): void {
  editingCategory.value = category
  categoryName.value = category.name
  formError.value = ''
  isFormOpen.value = true
}

async function loadCategories(): Promise<void> {
  isLoading.value = true
  errorMessage.value = ''

  try {
    categories.value = await categoriesApi.getCategories()
  } catch (error) {
    errorMessage.value =
      error instanceof ApiClientError ? error.message : 'Failed to load categories'
  } finally {
    isLoading.value = false
  }
}

async function handleSubmit(): Promise<void> {
  formError.value = ''
  isSubmitting.value = true

  try {
    if (editingCategory.value) {
      await adminApi.updateCategory(editingCategory.value.id, categoryName.value)
    } else {
      await adminApi.createCategory(categoryName.value)
    }

    resetForm()
    await loadCategories()
  } catch (error) {
    formError.value =
      error instanceof ApiClientError ? error.message : 'Failed to save category'
  } finally {
    isSubmitting.value = false
  }
}

async function handleDelete(categoryId: number): Promise<void> {
  deletingId.value = categoryId
  errorMessage.value = ''

  try {
    await adminApi.deleteCategory(categoryId)
    await loadCategories()
  } catch (error) {
    errorMessage.value =
      error instanceof ApiClientError ? error.message : 'Failed to delete category'
  } finally {
    deletingId.value = null
  }
}

onMounted(() => {
  void loadCategories()
})
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Categories</h2>
      <button
        type="button"
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        @click="openCreateForm"
      >
        Add category
      </button>
    </div>

    <div
      v-if="isFormOpen"
      class="mb-6 rounded-lg border border-gray-200 bg-white p-4"
    >
      <h3 class="mb-4 font-semibold text-gray-900">
        {{ editingCategory ? 'Edit category' : 'New category' }}
      </h3>
      <ErrorAlert v-if="formError" class="mb-4" :message="formError" />
      <form class="flex flex-wrap items-end gap-4" @submit.prevent="handleSubmit">
        <div class="min-w-64 flex-1">
          <FormField
            v-model="categoryName"
            label="Name"
            name="category_name"
            required
          />
        </div>
        <div class="flex gap-2">
          <button
            type="submit"
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Saving...' : 'Save' }}
          </button>
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            @click="resetForm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <LoadingState v-if="isLoading" message="Loading categories..." />
    <ErrorAlert v-else-if="errorMessage" :message="errorMessage" />

    <EmptyState
      v-else-if="categories.length === 0"
      message="No categories yet. Add one to get started."
    />

    <div v-else class="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table class="min-w-full text-left text-sm">
        <thead class="border-b border-gray-200 bg-gray-50">
          <tr>
            <th class="px-4 py-3 font-medium text-gray-700">Name</th>
            <th class="px-4 py-3 font-medium text-gray-700">Slug</th>
            <th class="px-4 py-3 font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="category in categories"
            :key="category.id"
            class="border-b border-gray-200"
          >
            <td class="px-4 py-3 font-medium text-gray-900">{{ category.name }}</td>
            <td class="px-4 py-3 text-gray-600">{{ category.slug }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button
                  type="button"
                  class="text-blue-600 hover:underline"
                  @click="openEditForm(category)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="text-red-600 hover:underline disabled:opacity-50"
                  :disabled="deletingId === category.id"
                  @click="handleDelete(category.id)"
                >
                  {{ deletingId === category.id ? 'Deleting...' : 'Delete' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
