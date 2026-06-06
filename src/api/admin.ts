import { apiRequest } from '@/api/client'
import type {
  AdminDashboard,
  AdminOrderDetail,
  AdminOrderSummary,
  Category,
  CreateProductPayload,
  MessageResponse,
  OrderStatus,
  Product,
  UpdateProductPayload,
} from '@/types/api'

export function getDashboard(): Promise<AdminDashboard> {
  return apiRequest<AdminDashboard>({
    method: 'GET',
    url: '/api/admin/dashboard',
  })
}

export function createCategory(name: string): Promise<Category> {
  return apiRequest<Category>({
    method: 'POST',
    url: '/api/admin/categories',
    data: { name },
  })
}

export function updateCategory(categoryId: number, name: string): Promise<Category> {
  return apiRequest<Category>({
    method: 'PUT',
    url: `/api/admin/categories/${categoryId}`,
    data: { name },
  })
}

export function deleteCategory(categoryId: number): Promise<MessageResponse> {
  return apiRequest<MessageResponse>({
    method: 'DELETE',
    url: `/api/admin/categories/${categoryId}`,
  })
}

export function createProduct(payload: CreateProductPayload): Promise<Product> {
  return apiRequest<Product>({
    method: 'POST',
    url: '/api/admin/products',
    data: payload,
  })
}

export function updateProduct(
  productId: number,
  payload: UpdateProductPayload,
): Promise<Product> {
  return apiRequest<Product>({
    method: 'PUT',
    url: `/api/admin/products/${productId}`,
    data: payload,
  })
}

export function deleteProduct(productId: number): Promise<MessageResponse> {
  return apiRequest<MessageResponse>({
    method: 'DELETE',
    url: `/api/admin/products/${productId}`,
  })
}

export function getAdminOrders(): Promise<AdminOrderSummary[]> {
  return apiRequest<AdminOrderSummary[]>({
    method: 'GET',
    url: '/api/admin/orders',
  })
}

export function getAdminOrder(orderId: number): Promise<AdminOrderDetail> {
  return apiRequest<AdminOrderDetail>({
    method: 'GET',
    url: `/api/admin/orders/${orderId}`,
  })
}

export function updateOrderStatus(
  orderId: number,
  status: OrderStatus,
): Promise<AdminOrderDetail> {
  return apiRequest<AdminOrderDetail>({
    method: 'PATCH',
    url: `/api/admin/orders/${orderId}`,
    data: { status },
  })
}
