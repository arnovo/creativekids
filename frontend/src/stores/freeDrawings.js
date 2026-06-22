import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useFreeDrawingsStore = defineStore('freeDrawings', () => {
  const drawings = ref([])
  const currentDrawing = ref(null)
  const isLoading = ref(false)

  async function fetchDrawings() {
    isLoading.value = true
    try {
      const response = await api.get('/free-drawings')
      drawings.value = response.data
    } catch (error) {
      console.error('Error fetching free drawings:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchDrawing(id) {
    isLoading.value = true
    try {
      const response = await api.get(`/free-drawings/${id}`)
      currentDrawing.value = response.data
      return currentDrawing.value
    } catch (error) {
      console.error(`Error fetching free drawing ${id}:`, error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function createDrawing(data) {
    try {
      const response = await api.post('/free-drawings', data)
      drawings.value.unshift(response.data)
      return response.data
    } catch (error) {
      console.error('Error creating free drawing:', error)
      return null
    }
  }

  async function updateDrawing(id, data) {
    try {
      const response = await api.put(`/free-drawings/${id}`, data)
      const index = drawings.value.findIndex(d => d.id === id)
      if (index !== -1) {
        drawings.value[index] = response.data
      }
      if (currentDrawing.value?.id === id) {
        currentDrawing.value = response.data
      }
      return response.data
    } catch (error) {
      console.error(`Error updating free drawing ${id}:`, error)
      return null
    }
  }

  async function deleteDrawing(id) {
    try {
      await api.delete(`/free-drawings/${id}`)
      drawings.value = drawings.value.filter(d => d.id !== id)
      if (currentDrawing.value?.id === id) {
        currentDrawing.value = null
      }
      return true
    } catch (error) {
      console.error(`Error deleting free drawing ${id}:`, error)
      return false
    }
  }

  return {
    drawings,
    currentDrawing,
    isLoading,
    fetchDrawings,
    fetchDrawing,
    createDrawing,
    updateDrawing,
    deleteDrawing
  }
})
