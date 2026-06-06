import { apiRequest } from '@/api/client'
import type { CheckoutPayload, OrderDetail, OrderSummary } from '@/types/api'

export function checkout(payload: CheckoutPayload): Promise<OrderDetail> {
  return apiRequest<OrderDetail>({
    method: 'POST',
    url: '/api/checkout',
    data: payload,
  })
}

export function getOrders(): Promise<OrderSummary[]> {
  return apiRequest<OrderSummary[]>({
    method: 'GET',
    url: '/api/orders',
  })
}

export function getOrder(orderId: number): Promise<OrderDetail> {
  return apiRequest<OrderDetail>({
    method: 'GET',
    url: `/api/orders/${orderId}`,
  })
}
