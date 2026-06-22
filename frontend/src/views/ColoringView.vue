<template>
  <v-container fluid class="pa-4 pa-md-6 fill-height bg-grey-lighten-4">
    <v-row class="fill-height ma-0">
      
      <!-- Gallery View (When no page selected) -->
      <v-col v-if="!coloringStore.currentPage" cols="12" class="pa-0 h-100">
        <v-card class="fill-height rounded-xl d-flex flex-column" elevation="2">
          
          <v-toolbar color="surface" flat class="border-b px-4">
            <v-toolbar-title class="font-weight-bold text-primary">Elige un dibujo para colorear</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-chip-group v-model="activeCategory" selected-class="text-primary bg-primary-container" mandatory>
              <v-chip value="all">Todos</v-chip>
              <v-chip value="Animales">Animales</v-chip>
              <v-chip value="Fantasía">Fantasía</v-chip>
              <v-chip value="Naturaleza">Naturaleza</v-chip>
            </v-chip-group>
          </v-toolbar>

          <div class="flex-grow-1 overflow-y-auto pa-6">
            <div v-if="coloringStore.isLoading" class="d-flex justify-center mt-12">
              <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
            </div>
            
            <v-row v-else>
              <v-col v-for="page in filteredPages" :key="page.id" cols="12" sm="6" md="4" lg="3">
                <v-card
                  class="rounded-xl overflow-hidden cursor-pointer"
                  elevation="3"
                  hover
                  @click="openPage(page)"
                >
                  <v-img
                    :src="page.svg_url"
                    aspect-ratio="1"
                    class="bg-grey-lighten-3 pa-4"
                    contain
                  >
                    <template v-slot:placeholder>
                      <div class="d-flex align-center justify-center fill-height">
                        <v-icon size="48" color="grey-lighten-1">mdi-palette-outline</v-icon>
                      </div>
                    </template>
                  </v-img>
                  <v-card-text class="d-flex justify-space-between align-center bg-white">
                    <span class="font-weight-bold text-truncate">{{ page.title }}</span>
                    <v-chip size="x-small" color="primary" variant="tonal" class="font-weight-bold text-uppercase">
                      {{ page.difficulty }}
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>

      <!-- Active Coloring Canvas View -->
      <v-col v-else cols="12" class="pa-0 h-100">
        <v-card class="fill-height rounded-xl d-flex flex-column position-relative" elevation="2">
          
          <v-toolbar color="white" flat class="border-b px-2" density="compact">
            <v-btn icon @click="closePage">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title class="font-weight-bold">{{ coloringStore.currentPage.title }}</v-toolbar-title>
          </v-toolbar>

          <div class="flex-grow-1 position-relative overflow-hidden bg-white">
            <DrawingCanvas
              ref="coloringCanvas"
              :brush-color="brushSettings.color"
              :brush-width="brushSettings.width"
              :tool="brushSettings.tool"
              :is-drawing-mode="brushSettings.tool !== 'fill'"
              :initial-data="coloringStore.currentPage?.user_data"
              @change="onCanvasChange"
            />

            <!-- Toolbar over canvas -->
            <div class="toolbar-container">
              <CanvasToolbar
                :model-value="brushSettings"
                @update:model-value="val => Object.assign(brushSettings, val)"
                :can-undo="canUndo"
                :can-redo="canRedo"
                @undo="triggerUndo"
                @redo="triggerRedo"
                @clear="triggerClear"
                @clear-sketch="triggerClearSketch"
                @save="saveCurrentProgress"
              />
            </div>
          </div>

        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useColoringStore } from '@/stores/coloring'
import DrawingCanvas from '@/components/DrawingCanvas.vue'
import CanvasToolbar from '@/components/CanvasToolbar.vue'

const coloringStore = useColoringStore()

// State
const activeCategory = ref('all')
const coloringCanvas = ref(null)

const brushSettings = reactive({ color: '#2196F3', width: 12, tool: 'brush' }) // Thicker default for coloring
const canUndo = ref(false)
const canRedo = ref(false)

// Computed
const filteredPages = computed(() => {
  if (activeCategory.value === 'all') return coloringStore.pages
  return coloringStore.pages.filter(p => p.category_name === activeCategory.value)
})

// Lifecycle
onMounted(() => {
  coloringStore.fetchPages()
})

// Methods
async function openPage(page) {
  await coloringStore.fetchPage(page.id)
  
  nextTick(() => {
    if (coloringCanvas.value && page.svg_url) {
      coloringCanvas.value.loadSvg(page.svg_url)
    }
  })
}

function closePage() {
  coloringStore.currentPage = null
}

// Canvas Toolbar wrappers
function onCanvasChange() {
  if (coloringCanvas.value) {
    canUndo.value = coloringCanvas.value.canUndo()
    canRedo.value = coloringCanvas.value.canRedo()
  }
}
function triggerUndo() { if (coloringCanvas.value) coloringCanvas.value.undo() }
function triggerRedo() { if (coloringCanvas.value) coloringCanvas.value.redo() }
function triggerClear() { if (coloringCanvas.value) coloringCanvas.value.clear() }
function triggerClearSketch() { if (coloringCanvas.value) coloringCanvas.value.clearSketchLines() }

const isSaving = ref(false)
async function saveCurrentProgress() {
  if (!coloringCanvas.value || !coloringStore.currentPage) return
  isSaving.value = true
  
  try {
    const strokes = coloringCanvas.value.getJsonData()
    const success = await coloringStore.saveProgress(coloringStore.currentPage.id, strokes)
    if (success) {
      alert('¡Progreso guardado correctamente!')
    } else {
      alert('Hubo un error al guardar.')
    }
  } catch (e) {
    console.error(e)
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.toolbar-container {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}
</style>
