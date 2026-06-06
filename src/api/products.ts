import { apiRequest } from '@/api/client'
import type { Product } from '@/types/api'

export function getProducts(categoryId?: number): Promise<Product[]> {
  return apiRequest<Product[]>({
    method: 'GET',
    url: '/api/products',
    params: categoryId === undefined ? undefined : { category_id: categoryId },
  })
}

export function getProduct(productId: number): Promise<Product> {
  return apiRequest<Product>({
    method: 'GET',
    url: `/api/products/${productId}`,
  })
}
