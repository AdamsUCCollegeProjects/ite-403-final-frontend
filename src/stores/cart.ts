import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import * as cartApi from '@/api/cart'
import type { CartItem } from '@/types/api'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const total = ref('0.00')
  const isLoading = ref(false)

  const itemCount = computed(() =>
    items.value.reduce((count, item) => count + item.quantity, 0),
  )

  function setCartState(cartItems: CartItem[], cartTotal: string): void {
    items.value = cartItems
    total.value = cartTotal
  }

  function clearCart(): void {
    items.value = []
    total.value = '0.00'
  }

  async function fetchCart(): Promise<void> {
    isLoading.value = true

    try {
      const cart = await cartApi.getCart()
      setCartState(cart.items, cart.total)
    } finally {
      isLoading.value = false
    }
  }

  async function addItem(productId: number, quantity: number): Promise<void> {
    await cartApi.addCartItem(productId, quantity)
    await fetchCart()
  }

  async function updateQuantity(productId: number, quantity: number): Promise<void> {
    await cartApi.addCartItem(productId, quantity)
    await fetchCart()
  }

  async function removeItem(productId: number): Promise<void> {
    await cartApi.removeCartItem(productId)
    await fetchCart()
  }

  return {
    items,
    total,
    isLoading,
    itemCount,
    fetchCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }
})
