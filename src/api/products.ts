import { apiRequest } from '@/api/client'
import type { Product } from '@/types/api'
import { unwrapList } from '@/utils/api'

export async function getProducts(categoryId?: number): Promise<Product[]> {
  const response = await apiRequest<{ products: Product[] } | Product[]>({
    method: 'GET',
    url: '/api/products',
    params: categoryId === undefined ? undefined : { category_id: categoryId },
  })

  return unwrapList<Product>(response, 'products')
}

export function getProduct(productId: number): Promise<Product> {
  return apiRequest<Product>({
    method: 'GET',
    url: `/api/products/${productId}`,
  })
}
