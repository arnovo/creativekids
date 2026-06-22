import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useSketchesStore = defineStore('sketches', () => {
  const sketches = ref([])
  const currentSketch = ref(null)
  const isLoading = ref(false)

  async function fetchSketches() {
    isLoading.value = true
    try {
      const response = await api.get('/sketches')
      sketches.value = response.data
    } catch (error) {
      console.error('Error fetching sketches:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchSketch(id) {
    isLoading.value = true
    try {
      const response = await api.get(`/sketches/${id}`)
      currentSketch.value = response.data
    } catch (error) {
      console.error(`Error fetching sketch ${id}:`, error)
    } finally {
      isLoading.value = false
    }
  }

  async function saveProgress(id, userData) {
    try {
      const response = await api.post(`/sketches/${id}/progress`, { user_data: userData })
      if (currentSketch.value && currentSketch.value.id === id) {
        currentSketch.value.user_data = response.data.user_data
      }
      return true
    } catch (error) {
      console.error(`Error saving progress for sketch ${id}:`, error)
      return false
    }
  }

  return {
    sketches,
    currentSketch,
    isLoading,
    fetchSketches,
    fetchSketch,
    saveProgress
  }
})
