<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Pencil, Plus, Trash2 } from 'lucide-vue-next'

import * as adminApi from '@/api/admin'
import * as categoriesApi from '@/api/categories'
import * as filesApi from '@/api/files'
import * as productsApi from '@/api/products'
import { ApiClientError } from '@/api/client'
import Button from '@/components/Button.vue'
import Card from '@/components/Card.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import FormField from '@/components/FormField.vue'
import ImageUploadField from '@/components/ImageUploadField.vue'
import LoadingState from '@/components/LoadingState.vue'
import PageHeader from '@/components/PageHeader.vue'
import ProductImage from '@/components/ProductImage.vue'
import type { Category, Product } from '@/types/api'
import { formatCurrency } from '@/utils/format'
import { resolveApiUrl } from '@/utils/resolveApiUrl'

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
const imageFileId = ref<string | null>(null)
const imagePreviewUrl = ref<string | null>(null)
const originalImageFileId = ref<string | null>(null)
const isFormOpen = ref(false)
const isSubmitting = ref(false)
const deletingId = ref<number | null>(null)
const successToastMessage = ref('')

const TOAST_HIDE_DELAY_MS = 1800
let hideToastTimer: ReturnType<typeof setTimeout> | null = null

function getCategoryName(categoryId: number): string {
  return categories.value.find((category) => category.id === categoryId)?.name ?? '—'
}

function resetForm(): void {
  formState.value = { ...EMPTY_FORM }
  editingProduct.value = null
  imageFileId.value = null
  imagePreviewUrl.value = null
  originalImageFileId.value = null
  isFormOpen.value = false
  formError.value = ''
}

function openCreateForm(): void {
  editingProduct.value = null
  formState.value = { ...EMPTY_FORM }
  imageFileId.value = null
  imagePreviewUrl.value = null
  originalImageFileId.value = null
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
  imageFileId.value = product.image_file_id
  imagePreviewUrl.value = resolveApiUrl(product.thumbnail_url)
  originalImageFileId.value = product.image_file_id
  formError.value = ''
  isFormOpen.value = true
}

function handleImageUploaded(payload: { id: string; previewUrl: string }): void {
  imageFileId.value = payload.id
  imagePreviewUrl.value = payload.previewUrl
}

function handleImageCleared(): void {
  imageFileId.value = null
  imagePreviewUrl.value = null
}

async function deleteReplacedImage(): Promise<void> {
  if (!originalImageFileId.value || originalImageFileId.value === imageFileId.value) {
    return
  }

  try {
    await filesApi.deleteFile(originalImageFileId.value)
  } catch {
    // Product save succeeded; orphaned file cleanup is best-effort.
  }
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
    errorMessage.value = error instanceof ApiClientError ? error.message : 'Failed to load products'
    products.value = []
    categories.value = []
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
      await adminApi.updateProduct(editingProduct.value.id, {
        ...payload,
        image_file_id: imageFileId.value,
      })
      await deleteReplacedImage()
    } else {
      const createPayload = imageFileId.value
        ? { ...payload, image_file_id: imageFileId.value }
        : payload

      await adminApi.createProduct(createPayload)
    }

    resetForm()
    await loadData()
  } catch (error) {
    formError.value = error instanceof ApiClientError ? error.message : 'Failed to save product'
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
    successToastMessage.value = 'Product deleted'
    if (hideToastTimer) {
      clearTimeout(hideToastTimer)
    }
    hideToastTimer = setTimeout(() => {
      successToastMessage.value = ''
      hideToastTimer = null
    }, TOAST_HIDE_DELAY_MS)
  } catch (error) {
    errorMessage.value =
      error instanceof ApiClientError ? error.message : 'Failed to delete product'
  } finally {
    deletingId.value = null
  }
}

onBeforeUnmount(() => {
  if (!hideToastTimer) {
    return
  }

  clearTimeout(hideToastTimer)
})

onMounted(() => {
  void loadData()
})
</script>

<template>
  <div>
    <div class="mb-6 flex items-start justify-between gap-4">
      <PageHeader compact title="Products" subtitle="Manage your product catalog" />
      <Button size="sm" class="shrink-0" @click="openCreateForm">
        <Plus class="h-4 w-4" />
        Add product
      </Button>
    </div>

    <Card v-if="isFormOpen" class="mb-6 p-5">
      <h3 class="mb-4 font-semibold text-slate-900">
        {{ editingProduct ? 'Edit product' : 'New product' }}
      </h3>
      <ErrorAlert v-if="formError" class="mb-4" :message="formError" />
      <form class="grid gap-4 sm:grid-cols-2" @submit.prevent="handleSubmit">
        <div>
          <label for="category_id" class="mb-1.5 block text-sm font-medium text-slate-700">
            Category <span class="text-red-500">*</span>
          </label>
          <select id="category_id" v-model="formState.category_id" required class="input-field">
            <option value="" disabled>Select category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <FormField v-model="formState.name" label="Name" name="product_name" required />
        <FormField
          v-model="formState.price"
          label="Price ( $ )"
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
          <label for="description" class="mb-1.5 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            v-model="formState.description"
            rows="3"
            required
            class="input-field"
          />
        </div>
        <div class="sm:col-span-2">
          <ImageUploadField
            :preview-url="imagePreviewUrl"
            @uploaded="handleImageUploaded"
            @cleared="handleImageCleared"
          />
        </div>
        <div class="flex gap-2 sm:col-span-2">
          <Button type="submit" size="sm" :disabled="isSubmitting">
            {{ isSubmitting ? 'Saving...' : 'Save' }}
          </Button>
          <Button variant="secondary" size="sm" type="button" @click="resetForm"> Cancel </Button>
        </div>
      </form>
    </Card>

    <LoadingState v-if="isLoading" message="Loading products..." />
    <ErrorAlert v-else-if="errorMessage" :message="errorMessage" />

    <EmptyState
      v-else-if="products.length === 0"
      message="No products yet. Add one to get started."
    />

    <div v-else class="table-container">
      <table class="min-w-full text-left text-sm">
        <thead class="table-header sticky top-0">
          <tr>
            <th class="px-4 py-3 font-semibold text-slate-700">Image</th>
            <th class="px-4 py-3 font-semibold text-slate-700">Name</th>
            <th class="px-4 py-3 font-semibold text-slate-700">Category</th>
            <th class="px-4 py-3 font-semibold text-slate-700">Price</th>
            <th class="px-4 py-3 font-semibold text-slate-700">Stock</th>
            <th class="px-4 py-3 font-semibold text-slate-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" class="table-row">
            <td class="px-4 py-4">
              <div class="h-12 w-12 overflow-hidden rounded-lg">
                <ProductImage
                  :thumbnail-url="product.thumbnail_url"
                  :category-id="product.category_id"
                  :category-name="getCategoryName(product.category_id)"
                  size="sm"
                  :alt="product.name"
                />
              </div>
            </td>
            <td class="px-4 py-4 font-medium text-slate-900">{{ product.name }}</td>
            <td class="px-4 py-4 text-muted-foreground">
              {{ getCategoryName(product.category_id) }}
            </td>
            <td class="px-4 py-4 text-muted-foreground">{{ formatCurrency(product.price) }}</td>
            <td class="px-4 py-4 text-muted-foreground">{{ product.stock }}</td>
            <td class="px-4 py-4">
              <div class="flex gap-1">
                <button
                  type="button"
                  class="btn-ghost btn-sm"
                  aria-label="Edit product"
                  @click="openEditForm(product)"
                >
                  <Pencil class="h-4 w-4" />
                </button>
                <button
                  type="button"
                  class="btn-ghost btn-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                  :disabled="deletingId === product.id"
                  aria-label="Delete product"
                  @click="handleDelete(product.id)"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="successToastMessage"
      class="fixed bottom-4 right-4 z-50 rounded-md bg-slate-900 px-3 py-2 text-sm text-white shadow-lg"
      role="status"
      aria-live="polite"
    >
      {{ successToastMessage }}
    </div>
  </div>
</template>
