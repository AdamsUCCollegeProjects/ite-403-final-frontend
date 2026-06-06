import { apiRequest } from '@/api/client'
import type { Category } from '@/types/api'
import { unwrapList } from '@/utils/api'

export async function getCategories(): Promise<Category[]> {
  const response = await apiRequest<{ categories: Category[] } | Category[]>({
    method: 'GET',
    url: '/api/categories',
  })

  return unwrapList<Category>(response, 'categories')
}

export function getCategory(categoryId: number): Promise<Category> {
  return apiRequest<Category>({
    method: 'GET',
    url: `/api/categories/${categoryId}`,
  })
}
