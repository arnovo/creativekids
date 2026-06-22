import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref([])
  const categories = ref([])
  const isLoading = ref(false)

  async function fetchCategories() {
    try {
      const response = await api.get('/categories')
      categories.value = response.data
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  async function fetchNotes(categoryId = null) {
    isLoading.value = true
    try {
      const params = categoryId ? { category_id: categoryId } : {}
      const response = await api.get('/notes', { params })
      notes.value = response.data
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function saveNote(noteData) {
    try {
      if (noteData.id) {
        const response = await api.put(`/notes/${noteData.id}`, noteData)
        const index = notes.value.findIndex(n => n.id === noteData.id)
        if (index !== -1) notes.value[index] = response.data
        return response.data
      } else {
        const response = await api.post('/notes', noteData)
        notes.value.unshift(response.data)
        return response.data
      }
    } catch (error) {
      console.error('Error saving note:', error)
      throw error
    }
  }

  async function deleteNote(id) {
    try {
      await api.delete(`/notes/${id}`)
      notes.value = notes.value.filter(n => n.id !== id)
    } catch (error) {
      console.error(`Error deleting note ${id}:`, error)
    }
  }

  async function createCategory(categoryData) {
    try {
      const response = await api.post('/categories', categoryData)
      categories.value.push(response.data)
      return response.data
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  }

  return {
    notes,
    categories,
    isLoading,
    fetchCategories,
    fetchNotes,
    saveNote,
    deleteNote,
    createCategory,
  }
})
