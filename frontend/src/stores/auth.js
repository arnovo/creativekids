import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('creativakids_token') || null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials) {
    isLoading.value = true
    try {
      const response = await api.post('/login', credentials)
      const data = response.data
      token.value = data.access_token
      user.value = data.user
      localStorage.setItem('creativakids_token', data.access_token)
      return true
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function register(userData) {
    isLoading.value = true
    try {
      const response = await api.post('/register', userData)
      const data = response.data
      token.value = data.access_token
      user.value = data.user
      localStorage.setItem('creativakids_token', data.access_token)
      return true
    } catch (error) {
      console.error('Error al registrar usuario:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      await api.post('/logout')
    } catch (error) {
      console.error('Error al revocar token en servidor:', error)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('creativakids_token')
    }
  }

  async function fetchUser() {
    if (!token.value) return null
    isLoading.value = true
    try {
      const response = await api.get('/me')
      user.value = response.data
      return response.data
    } catch (error) {
      console.error('Error al recuperar usuario:', error)
      logout() // Limpiar sesión si el token ya no es válido
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
  }
})
