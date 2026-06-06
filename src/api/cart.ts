import { apiRequest } from '@/api/client'
import type { CartItem, CartResponse, MessageResponse } from '@/types/api'

export function getCart(): Promise<CartResponse> {
  return apiRequest<CartResponse>({
    method: 'GET',
    url: '/api/cart',
  })
}

export function addCartItem(productId: number, quantity: number): Promise<CartItem> {
  return apiRequest<CartItem>({
    method: 'POST',
    url: '/api/cart/items',
    data: {
      product_id: productId,
      quantity,
    },
  })
}

export function removeCartItem(productId: number): Promise<MessageResponse> {
  return apiRequest<MessageResponse>({
    method: 'DELETE',
    url: `/api/cart/items/${productId}`,
  })
}
