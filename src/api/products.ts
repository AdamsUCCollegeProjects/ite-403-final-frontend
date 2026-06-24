import { apiRequest } from '@/api/client'
import type { Product } from '@/types/api'
import { unwrapList } from '@/utils/api'

export interface ProductListFilters {
  categoryId?: number
  searchQuery?: string
}

export async function getProducts(filters: ProductListFilters = {}): Promise<Product[]> {
  const params: Record<string, string | number> = {}

  if (filters.categoryId !== undefined) {
    params.category_id = filters.categoryId
  }

  const trimmedSearch = filters.searchQuery?.trim()
  if (trimmedSearch) {
    params.q = trimmedSearch
  }

  const response = await apiRequest<{ products: Product[] } | Product[]>({
    method: 'GET',
    url: '/api/products',
    params: Object.keys(params).length === 0 ? undefined : params,
  })

  return unwrapList<Product>(response, 'products')
}

export function getProduct(productId: number): Promise<Product> {
  return apiRequest<Product>({
    method: 'GET',
    url: `/api/products/${productId}`,
  })
}
