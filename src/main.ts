import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './assets/main.css'

import { setUnauthorizedHandler } from '@/api/client'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

const authStore = useAuthStore()

setUnauthorizedHandler(() => {
  authStore.clearSession()
  useCartStore().clearCart()
})

void authStore.initialize().then(() => {
  app.mount('#app')
})
