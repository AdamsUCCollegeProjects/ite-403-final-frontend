import { apiRequest } from '@/api/client'
import type { CheckoutPayload, CheckoutResponse, OrderDetail, OrderSummary } from '@/types/api'
import { unwrapList } from '@/utils/api'

export function checkout(payload: CheckoutPayload): Promise<CheckoutResponse> {
  return apiRequest<CheckoutResponse>({
    method: 'POST',
    url: '/api/checkout',
    data: payload,
  })
}

export async function getOrders(): Promise<OrderSummary[]> {
  const response = await apiRequest<{ orders: OrderSummary[] } | OrderSummary[]>({
    method: 'GET',
    url: '/api/orders',
  })

  return unwrapList<OrderSummary>(response, 'orders')
}

export function getOrder(orderId: number): Promise<OrderDetail> {
  return apiRequest<OrderDetail>({
    method: 'GET',
    url: `/api/orders/${orderId}`,
  })
}
