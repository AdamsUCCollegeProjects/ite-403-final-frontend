<script setup lang="ts">
import { onMounted, ref } from 'vue'

import * as adminApi from '@/api/admin'
import * as categoriesApi from '@/api/categories'
import * as productsApi from '@/api/products'
import { ApiClientError } from '@/api/client'
import EmptyState from '@/components/EmptyState.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import FormField from '@/components/FormField.vue'
import LoadingState from '@/components/LoadingState.vue'
import type { Category, Product } from '@/types/api'
import { formatCurrency } from '@/utils/format'

interface ProductFormState {
  category_id: string
  name: string
  description: string
  price: string
  stock: string
}

const EMPTY_FORM: ProductFormState = {
  category_id: '',
  name: '',
  description: '',
  price: '',
  stock: '',
}

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const isLoading = ref(true)
const errorMessage = ref('')
const formError = ref('')
const formState = ref<ProductFormState>({ ...EMPTY_FORM })
const editingProduct = ref<Product | null>(null)
const isFormOpen = ref(false)
const isSubmitting = ref(false)
const deletingId = ref<number | null>(null)

function getCategoryName(categoryId: number): string {
  return categories.value.find((category) => category.id === categoryId)?.name ?? '—'
}

function resetForm(): void {
  formState.value = { ...EMPTY_FORM }
  editingProduct.value = null
  isFormOpen.value = false
  formError.value = ''
}

function openCreateForm(): void {
  editingProduct.value = null
  formState.value = { ...EMPTY_FORM }
  formError.value = ''
  isFormOpen.value = true
}

function openEditForm(product: Product): void {
  editingProduct.value = product
  formState.value = {
    category_id: String(product.category_id),
    name: product.name,
    description: product.description,
    price: product.price,
    stock: String(product.stock),
  }
  formError.value = ''
  isFormOpen.value = true
}

async function loadData(): Promise<void> {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const [productList, categoryList] = await Promise.all([
      productsApi.getProducts(),
      categoriesApi.getCategories(),
    ])

    products.value = productList
    categories.value = categoryList
  } catch (error) {
    errorMessage.value =
      error instanceof ApiClientError ? error.message : 'Failed to load products'
  } finally {
    isLoading.value = false
  }
}

async function handleSubmit(): Promise<void> {
  formError.value = ''
  isSubmitting.value = true

  const payload = {
    category_id: Number.parseInt(formState.value.category_id, 10),
    name: formState.value.name,
    description: formState.value.description,
    price: formState.value.price,
    stock: Number.parseInt(formState.value.stock, 10),
  }

  try {
    if (editingProduct.value) {
      await adminApi.updateProduct(editingProduct.value.id, payload)
    } else {
      await adminApi.createProduct(payload)
    }

    resetForm()
    await loadData()
  } catch (error) {
    formError.value =
      error instanceof ApiClientError ? error.message : 'Failed to save product'
  } finally {
    isSubmitting.value = false
  }
}

async function handleDelete(productId: number): Promise<void> {
  deletingId.value = productId
  errorMessage.value = ''

  try {
    await adminApi.deleteProduct(productId)
    await loadData()
  } catch (error) {
    errorMessage.value =
      error instanceof ApiClientError ? error.message : 'Failed to delete product'
  } finally {
    deletingId.value = null
  }
}

onMounted(() => {
  void loadData()
})
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900">Products</h2>
      <button
        type="button"
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        @click="openCreateForm"
      >
        Add product
      </button>
    </div>

    <div v-if="isFormOpen" class="mb-6 rounded-lg border border-gray-200 bg-white p-4">
      <h3 class="mb-4 font-semibold text-gray-900">
        {{ editingProduct ? 'Edit product' : 'New product' }}
      </h3>
      <ErrorAlert v-if="formError" class="mb-4" :message="formError" />
      <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="handleSubmit">
        <div>
          <label for="category_id" class="mb-1 block text-sm font-medium text-gray-700">
            Category <span class="text-red-500">*</span>
          </label>
          <select
            id="category_id"
            v-model="formState.category_id"
            required
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="" disabled>Select category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <FormField v-model="formState.name" label="Name" name="product_name" required />
        <FormField
          v-model="formState.price"
          label="Price"
          name="product_price"
          type="number"
          required
        />
        <FormField
          v-model="formState.stock"
          label="Stock"
          name="product_stock"
          type="number"
          required
        />
        <div class="sm:col-span-2">
          <label for="description" class="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            v-model="formState.description"
            rows="3"
            required
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div class="flex gap-2 sm:col-span-2">
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

    <LoadingState v-if="isLoading" message="Loading products..." />
    <ErrorAlert v-else-if="errorMessage" :message="errorMessage" />

    <EmptyState
      v-else-if="products.length === 0"
      message="No products yet. Add one to get started."
    />

    <div v-else class="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table class="min-w-full text-left text-sm">
        <thead class="border-b border-gray-200 bg-gray-50">
          <tr>
            <th class="px-4 py-3 font-medium text-gray-700">Name</th>
            <th class="px-4 py-3 font-medium text-gray-700">Category</th>
            <th class="px-4 py-3 font-medium text-gray-700">Price</th>
            <th class="px-4 py-3 font-medium text-gray-700">Stock</th>
            <th class="px-4 py-3 font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in products"
            :key="product.id"
            class="border-b border-gray-200"
          >
            <td class="px-4 py-3 font-medium text-gray-900">{{ product.name }}</td>
            <td class="px-4 py-3 text-gray-600">{{ getCategoryName(product.category_id) }}</td>
            <td class="px-4 py-3 text-gray-600">{{ formatCurrency(product.price) }}</td>
            <td class="px-4 py-3 text-gray-600">{{ product.stock }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button
                  type="button"
                  class="text-blue-600 hover:underline"
                  @click="openEditForm(product)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="text-red-600 hover:underline disabled:opacity-50"
                  :disabled="deletingId === product.id"
                  @click="handleDelete(product.id)"
                >
                  {{ deletingId === product.id ? 'Deleting...' : 'Delete' }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
