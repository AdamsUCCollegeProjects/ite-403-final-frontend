import { apiRequest } from '@/api/client'
import type { Category } from '@/types/api'

export function getCategories(): Promise<Category[]> {
  return apiRequest<Category[]>({
    method: 'GET',
    url: '/api/categories',
  })
}

export function getCategory(categoryId: number): Promise<Category> {
  return apiRequest<Category>({
    method: 'GET',
    url: `/api/categories/${categoryId}`,
  })
}
