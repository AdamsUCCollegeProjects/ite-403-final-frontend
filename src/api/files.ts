import { apiRequest } from '@/api/client'
import type { UploadedFile } from '@/types/api'

export function uploadFile(file: File): Promise<UploadedFile> {
  const formData = new FormData()
  formData.append('file', file)

  return apiRequest<UploadedFile>({
    method: 'POST',
    url: '/api/files',
    data: formData,
    headers: {
      'Content-Type': undefined,
    },
  })
}

export function deleteFile(fileId: string): Promise<void> {
  return apiRequest<void>({
    method: 'DELETE',
    url: `/api/files/${fileId}`,
  })
}
