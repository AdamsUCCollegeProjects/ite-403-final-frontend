<script setup lang="ts">
import { ref } from 'vue'
import { ImagePlus, Loader2, Trash2, Upload } from 'lucide-vue-next'

import * as filesApi from '@/api/files'
import { ApiClientError } from '@/api/client'
import { resolveApiUrl } from '@/utils/resolveApiUrl'

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
const MAX_FILE_SIZE_MB = 10

defineProps<{
  previewUrl?: string | null
}>()

const emit = defineEmits<{
  uploaded: [payload: { id: string; previewUrl: string }]
  cleared: []
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const uploadError = ref('')
const isDragging = ref(false)

function validateFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return 'Please choose a JPEG, PNG, GIF, or WebP image.'
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `Image must be ${MAX_FILE_SIZE_MB} MB or smaller.`
  }

  return null
}

function openFilePicker(): void {
  if (isUploading.value) {
    return
  }

  fileInputRef.value?.click()
}

function handleDragOver(event: DragEvent): void {
  event.preventDefault()
  isDragging.value = true
}

function handleDragLeave(): void {
  isDragging.value = false
}

function handleDrop(event: DragEvent): void {
  event.preventDefault()
  isDragging.value = false

  const droppedFile = event.dataTransfer?.files.item(0)

  if (droppedFile) {
    void processFile(droppedFile)
  }
}

function handleFileChange(event: Event): void {
  const input = event.target as HTMLInputElement
  const selectedFile = input.files?.item(0)

  if (selectedFile) {
    void processFile(selectedFile)
  }

  input.value = ''
}

async function processFile(file: File): Promise<void> {
  uploadError.value = ''

  const validationError = validateFile(file)

  if (validationError) {
    uploadError.value = validationError
    return
  }

  isUploading.value = true

  try {
    const uploadedFile = await filesApi.uploadFile(file)
    const previewUrl =
      resolveApiUrl(uploadedFile.thumbnail?.url ?? uploadedFile.url) ??
      URL.createObjectURL(file)

    emit('uploaded', { id: uploadedFile.id, previewUrl })
  } catch (error) {
    uploadError.value =
      error instanceof ApiClientError ? error.message : 'Failed to upload image'
  } finally {
    isUploading.value = false
  }
}

function handleClear(): void {
  uploadError.value = ''
  emit('cleared')
}
</script>

<template>
  <div>
    <label class="mb-1.5 block text-sm font-medium text-slate-700">Product image</label>

    <div
      v-if="previewUrl"
      class="card flex items-center gap-4 p-4"
    >
      <img
        :src="previewUrl"
        alt="Product preview"
        class="h-20 w-20 shrink-0 rounded-lg object-cover"
      />
      <div class="min-w-0 flex-1">
        <p class="text-sm text-muted-foreground">Image ready to save with this product.</p>
        <div class="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            class="btn-secondary btn-sm"
            :disabled="isUploading"
            @click="openFilePicker"
          >
            <Upload class="h-4 w-4" />
            Replace
          </button>
          <button
            type="button"
            class="btn-ghost btn-sm text-red-600 hover:bg-red-50 hover:text-red-700"
            :disabled="isUploading"
            @click="handleClear"
          >
            <Trash2 class="h-4 w-4" />
            Remove
          </button>
        </div>
      </div>
    </div>

    <div
      v-else
      class="card flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-8 transition-colors"
      :class="isDragging ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-300'"
      role="button"
      tabindex="0"
      @click="openFilePicker"
      @keydown.enter="openFilePicker"
      @keydown.space.prevent="openFilePicker"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <Loader2 v-if="isUploading" class="h-8 w-8 animate-spin text-brand-600" />
      <ImagePlus v-else class="h-8 w-8 text-slate-400" />
      <p class="mt-3 text-sm font-medium text-slate-700">
        {{ isUploading ? 'Uploading...' : 'Choose image or drag and drop' }}
      </p>
      <p class="mt-1 text-xs text-muted-foreground">
        JPEG, PNG, GIF, or WebP up to {{ MAX_FILE_SIZE_MB }} MB
      </p>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      accept="image/jpeg,image/png,image/gif,image/webp"
      class="hidden"
      @change="handleFileChange"
    />

    <p v-if="uploadError" class="mt-1.5 text-sm text-red-600">{{ uploadError }}</p>
  </div>
</template>
