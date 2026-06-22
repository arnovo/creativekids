import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Main application store.
 * Manages global state: active module, user preferences, loading states.
 */
export const useAppStore = defineStore('app', () => {
  // ─── State ──────────────────────────────────────────────
  const activeModule = ref('home')
  const isLoading = ref(false)
  const currentUser = ref({
    name: 'Pequeño Artista',
    avatar: null,
  })

  // ─── Actions ────────────────────────────────────────────
  function setActiveModule(module) {
    activeModule.value = module
  }

  function setLoading(state) {
    isLoading.value = state
  }

  return {
    activeModule,
    isLoading,
    currentUser,
    setActiveModule,
    setLoading,
  }
})
