<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Pencil, Plus, Trash2 } from 'lucide-vue-next'

import * as adminApi from '@/api/admin'
import * as categoriesApi from '@/api/categories'
import { ApiClientError } from '@/api/client'
import Button from '@/components/Button.vue'
import Card from '@/components/Card.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import FormField from '@/components/FormField.vue'
import LoadingState from '@/components/LoadingState.vue'
import PageHeader from '@/components/PageHeader.vue'
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
    <div class="mb-6 flex items-start justify-between gap-4">
      <PageHeader compact title="Categories" subtitle="Manage product categories" />
      <Button size="sm" class="shrink-0" @click="openCreateForm">
        <Plus class="h-4 w-4" />
        Add category
      </Button>
    </div>

    <Card v-if="isFormOpen" class="mb-6 p-5">
      <h3 class="mb-4 font-semibold text-slate-900">
        {{ editingCategory ? 'Edit category' : 'New category' }}
      </h3>
      <ErrorAlert v-if="formError" class="mb-4" :message="formError" />
      <form class="flex flex-wrap items-end gap-4" @submit.prevent="handleSubmit">
        <div class="min-w-64 flex-1">
          <FormField v-model="categoryName" label="Name" name="category_name" required />
        </div>
        <div class="flex gap-2">
          <Button type="submit" size="sm" :disabled="isSubmitting">
            {{ isSubmitting ? 'Saving...' : 'Save' }}
          </Button>
          <Button variant="secondary" size="sm" type="button" @click="resetForm">
            Cancel
          </Button>
        </div>
      </form>
    </Card>

    <LoadingState v-if="isLoading" message="Loading categories..." />
    <ErrorAlert v-else-if="errorMessage" :message="errorMessage" />

    <EmptyState
      v-else-if="categories.length === 0"
      message="No categories yet. Add one to get started."
    />

    <div v-else class="table-container">
      <table class="min-w-full text-left text-sm">
        <thead class="table-header sticky top-0">
          <tr>
            <th class="px-4 py-3 font-semibold text-slate-700">Name</th>
            <th class="px-4 py-3 font-semibold text-slate-700">Slug</th>
            <th class="px-4 py-3 font-semibold text-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id" class="table-row">
            <td class="px-4 py-4 font-medium text-slate-900">{{ category.name }}</td>
            <td class="px-4 py-4 text-muted-foreground">{{ category.slug }}</td>
            <td class="px-4 py-4">
              <div class="flex gap-1">
                <button
                  type="button"
                  class="btn-ghost btn-sm"
                  aria-label="Edit category"
                  @click="openEditForm(category)"
                >
                  <Pencil class="h-4 w-4" />
                </button>
                <button
                  type="button"
                  class="btn-ghost btn-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                  :disabled="deletingId === category.id"
                  aria-label="Delete category"
                  @click="handleDelete(category.id)"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
