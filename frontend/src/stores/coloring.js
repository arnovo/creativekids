import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useColoringStore = defineStore('coloring', () => {
  const pages = ref([])
  const currentPage = ref(null)
  const isLoading = ref(false)

  async function fetchPages(category = null) {
    isLoading.value = true
    try {
      const params = category ? { category } : {}
      const response = await api.get('/coloring-pages', { params })
      pages.value = response.data
    } catch (error) {
      console.error('Error fetching coloring pages:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPage(id) {
    isLoading.value = true
    try {
      const response = await api.get(`/coloring-pages/${id}`)
      currentPage.value = response.data
      return currentPage.value
    } catch (error) {
      console.error(`Error fetching coloring page ${id}:`, error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function saveProgress(id, userData) {
    try {
      const response = await api.post(`/coloring-pages/${id}/progress`, { user_data: userData })
      if (currentPage.value && currentPage.value.id === id) {
        currentPage.value.user_data = response.data.user_data
      }
      return true
    } catch (error) {
      console.error(`Error saving progress for coloring page ${id}:`, error)
      return false
    }
  }

  return {
    pages,
    currentPage,
    isLoading,
    fetchPages,
    fetchPage,
    saveProgress
  }
})
