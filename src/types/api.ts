export type UserRole = 'user' | 'admin'

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export interface User {
  id: number
  email: string
  name: string
  role: UserRole
  created_at: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  name: string
}

export interface LoginResponse {
  token: string
  expires_in: number
}

export interface Category {
  id: number
  name: string
  slug: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  category_id: number
  name: string
  description: string
  price: string
  stock: number
  image_file_id: string | null
  image_url: string | null
  thumbnail_url: string | null
  created_at: string
  updated_at: string
}

export interface CreateProductPayload {
  category_id: number
  name: string
  description: string
  price: string
  stock: number
  image_file_id?: string | null
}

export interface UpdateProductPayload {
  category_id?: number
  name?: string
  description?: string
  price?: string
  stock?: number
  image_file_id?: string | null
}

export interface UploadedFileThumbnail {
  mime_type: string
  file_size: number
  width: number
  height: number
  url: string
}

export interface UploadedFile {
  id: string
  original_filename: string
  stored_filename: string
  mime_type: string
  file_size: number
  storage_path: string
  thumbnail: UploadedFileThumbnail | null
  url: string
  created_at: string
}

export interface CartItem {
  id: number
  product_id: number
  product_name: string
  unit_price: string
  quantity: number
  line_total: string
}

export interface CartResponse {
  items: CartItem[]
  total: string
}

export interface CheckoutPayload {
  shipping_name: string
  shipping_address: string
  shipping_city: string
  shipping_postal_code: string
  shipping_phone: string
}

export interface OrderItem {
  id: number
  product_id: number
  product_name: string
  unit_price: string
  quantity: number
  line_total: string
}

export interface OrderSummary {
  id: number
  status: OrderStatus
  total: string
  shipping_name: string
  shipping_address: string
  shipping_city: string
  shipping_postal_code: string
  shipping_phone: string
  created_at: string
  updated_at: string
}

export interface OrderDetail extends OrderSummary {
  items: OrderItem[]
}

export interface AdminOrderSummary extends OrderSummary {
  user_id: number
}

export interface AdminOrderDetail extends AdminOrderSummary {
  items: OrderItem[]
}

export interface AdminDashboard {
  total_orders: number
  total_revenue: string
  total_users: number
  total_products: number
  recent_orders: AdminOrderSummary[]
}

export interface ApiErrorResponse {
  error: string
  details?: Record<string, string>
}

export interface NormalizedApiError {
  message: string
  fieldErrors?: Record<string, string>
}

export interface MessageResponse {
  message: string
}
