<template>
  <div class="h-100 w-100 d-flex flex-row bg-grey-lighten-4 pa-4 gap-4 overflow-hidden" style="max-height: calc(100vh - 64px);">
    
    <!-- Left Panel: Steps and Reference -->
    <v-card 
      v-show="!isTraceMode" 
      class="d-flex flex-column flex-shrink-0 rounded-xl overflow-hidden" 
      width="360" 
      elevation="2"
    >
      <!-- Sketch Selection List (if no sketch selected) -->
      <template v-if="!sketchesStore.currentSketch">
        <v-card-title class="bg-primary text-white font-weight-bold py-4">
          Selecciona un Dibujo
        </v-card-title>
        
        <v-list lines="two" class="bg-transparent flex-grow-1 overflow-y-auto">
          <v-list-item
            v-for="sketch in sketchesStore.sketches"
            :key="sketch.id"
            :title="sketch.title"
            :subtitle="sketch.description"
            class="border-b"
            @click="loadSketch(sketch.id)"
          >
            <template v-slot:prepend>
              <v-avatar color="primary-container" size="48" class="mr-3 text-primary font-weight-bold">
                {{ sketch.title.charAt(0) }}
              </v-avatar>
            </template>
            <template v-slot:append>
              <v-chip size="small" :color="getDifficultyColor(sketch.difficulty)" class="text-uppercase font-weight-bold">
                {{ sketch.difficulty }}
              </v-chip>
            </template>
          </v-list-item>
        </v-list>
      </template>

      <!-- Active Sketch Panel -->
      <template v-else>
        <v-card-title class="bg-primary text-white d-flex align-center py-3 flex-shrink-0">
          <v-btn icon="mdi-arrow-left" variant="text" size="small" color="white" class="mr-2" @click="closeSketch"></v-btn>
          <span class="text-truncate font-weight-bold flex-grow-1">{{ sketchesStore.currentSketch.title }}</span>
          <v-chip color="white" variant="flat" size="small" class="text-primary font-weight-bold ml-2">
            Paso {{ currentStepIndex + 1 }} / {{ sketchesStore.currentSketch.total_steps }}
          </v-chip>
        </v-card-title>

        <!-- Step Viewer -->
        <div class="flex-grow-1 bg-white position-relative d-flex align-center justify-center pa-4 overflow-hidden">
          <v-progress-circular v-if="sketchesStore.isLoading" indeterminate color="primary"></v-progress-circular>
          
          <template v-else-if="currentStepData">
            <v-img
              :src="currentStepData.image_url"
              class="w-100 h-100"
              contain
              alt="Paso actual"
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-icon size="48" color="grey-lighten-2">mdi-image</v-icon>
                </div>
              </template>
            </v-img>
          </template>
        </div>

        <v-divider class="flex-shrink-0"></v-divider>

        <!-- Instructions and Navigation -->
        <div class="pa-4 bg-surface-variant flex-shrink-0">
          <p class="text-body-1 font-weight-medium mb-2 text-center" style="min-height: 24px;">
            {{ currentStepData?.description || 'Cargando paso...' }}
          </p>

          <div class="d-flex justify-center mb-4" style="min-height: 24px;">
            <v-chip
              v-if="currentStepIndex < (sketchesStore.currentSketch?.total_steps || 1) - 1"
              color="info" variant="flat" size="small" class="font-weight-bold cursor-pointer elevation-2"
              @click="brushSettings.color = '#90CAF9'; brushSettings.tool = 'brush'"
            >
              <v-icon start size="16">mdi-pencil</v-icon>
              ¡Usa el lápiz azul! (Click para seleccionar)
            </v-chip>
            <v-chip
              v-else
              color="black" variant="flat" size="small" class="text-white font-weight-bold cursor-pointer elevation-2"
              @click="brushSettings.color = '#000000'; brushSettings.tool = 'brush'"
            >
              <v-icon start size="16">mdi-marker</v-icon>
              ¡Usa el rotulador negro! (Click para seleccionar)
            </v-chip>
          </div>

          <div class="d-flex justify-space-between align-center">
            <v-btn
              variant="tonal"
              color="primary"
              icon="mdi-chevron-left"
              :disabled="currentStepIndex === 0"
              @click="prevStep"
              title="Paso anterior"
            ></v-btn>
            
            <v-btn
              color="secondary"
              prepend-icon="mdi-draw-pen"
              @click="isTraceMode = true"
              elevation="2"
              class="font-weight-bold px-6"
              title="Entrar en modo calcar"
            >
              Calcar
            </v-btn>

            <v-btn
              color="primary"
              icon="mdi-chevron-right"
              :disabled="currentStepIndex >= (sketchesStore.currentSketch?.total_steps || 1) - 1"
              @click="nextStep"
              elevation="2"
              title="Siguiente paso"
            ></v-btn>
          </div>
        </div>
      </template>
    </v-card>

    <!-- Right Panel: Drawing Canvas -->
    <v-card 
      class="flex-grow-1 rounded-xl d-flex flex-column position-relative overflow-hidden bg-white" 
      elevation="2"
    >
      <!-- Canvas overlay when no sketch selected -->
      <div v-if="!sketchesStore.currentSketch" class="position-absolute w-100 h-100 bg-white d-flex align-center justify-center flex-column" style="z-index: 5;">
        <v-icon size="96" color="grey-lighten-3" class="mb-4">mdi-draw</v-icon>
        <h3 class="text-h5 text-grey">Selecciona un dibujo a la izquierda para empezar</h3>
      </div>

      <div class="flex-grow-1 position-relative w-100 h-100">
        <DrawingCanvas
          ref="drawingCanvas"
          :brush-color="brushSettings.color"
          :brush-width="brushSettings.width"
          :tool="brushSettings.tool"
          :is-drawing-mode="brushSettings.tool !== 'fill'"
          :initial-data="sketchesStore.currentSketch?.user_data"
          @change="onCanvasChange"
        />
      </div>

      <!-- Trace Mode Controls (Overlay on canvas) -->
      <v-sheet v-if="isTraceMode" class="position-absolute rounded-pill d-flex align-center pa-1 elevation-4 bg-white" style="bottom: 16px; left: 50%; transform: translateX(-50%); z-index: 10;">
        <v-btn icon="mdi-chevron-left" variant="text" size="small" :disabled="currentStepIndex === 0" @click="prevStep" title="Paso anterior"></v-btn>
        <span class="px-4 font-weight-bold text-primary">Paso {{ currentStepIndex + 1 }} / {{ sketchesStore.currentSketch.total_steps }}</span>
        <v-btn icon="mdi-chevron-right" variant="text" size="small" :disabled="currentStepIndex >= (sketchesStore.currentSketch?.total_steps || 1) - 1" @click="nextStep" title="Siguiente paso"></v-btn>
        <v-divider vertical class="mx-2"></v-divider>
        <v-btn :icon="isTraceVisible ? 'mdi-eye' : 'mdi-eye-off'" variant="text" :color="isTraceVisible ? 'primary' : 'grey'" size="small" @click="toggleTrace" title="Mostrar/ocultar dibujo guía"></v-btn>
        <v-btn icon="mdi-close" variant="text" color="error" size="small" @click="isTraceMode = false" title="Cerrar modo calcar"></v-btn>
      </v-sheet>

      <!-- Floating Toolbar -->
      <div class="toolbar-container" v-show="sketchesStore.currentSketch">
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
          @download="downloadDrawing"
          @print="printDrawing"
        />
      </div>
    </v-card>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSketchesStore } from '@/stores/sketches'
import { useAuthStore } from '@/stores/auth'
import DrawingCanvas from '@/components/DrawingCanvas.vue'
import CanvasToolbar from '@/components/CanvasToolbar.vue'

const router = useRouter()
const sketchesStore = useSketchesStore()
const authStore = useAuthStore()

// State
const currentStepIndex = ref(0)
const drawingCanvas = ref(null)
const isTraceMode = ref(false)

const isTraceVisible = ref(true)

const brushSettings = reactive({
  color: '#000000',
  width: 5,
  tool: 'brush'
})
const canUndo = ref(false)
const canRedo = ref(false)

// Computed
const currentStepData = computed(() => {
  if (!sketchesStore.currentSketch?.steps) return null
  return sketchesStore.currentSketch.steps[currentStepIndex.value] || null
})

// Lifecycle
onMounted(() => {
  sketchesStore.fetchSketches()
})

// Watchers for Trace Mode
watch([isTraceMode, currentStepIndex], ([traceEnabled]) => {
  if (drawingCanvas.value) {
    if (traceEnabled && currentStepData.value?.image_url) {
      drawingCanvas.value.setTraceImage(currentStepData.value.image_url)
      isTraceVisible.value = true
    } else {
      drawingCanvas.value.setTraceImage(null)
    }
  }
})

// Methods
async function loadSketch(id) {
  await sketchesStore.fetchSketch(id)
  const savedStep = sketchesStore.currentSketch?.user_data?.saved_step_index
  currentStepIndex.value = (typeof savedStep === 'number') ? savedStep : 0
  isTraceMode.value = false
  triggerClear()
}

function closeSketch() {
  sketchesStore.currentSketch = null
  isTraceMode.value = false
  triggerClear()
}

function nextStep() {
  if (currentStepIndex.value < sketchesStore.currentSketch.total_steps - 1) {
    currentStepIndex.value++
  }
}

function prevStep() {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--
  }
}

function toggleTrace() {
  if (drawingCanvas.value) {
    isTraceVisible.value = drawingCanvas.value.toggleTraceVisibility()
  }
}

// Canvas interactions
function getDifficultyColor(diff) {
  const map = { 'fácil': 'success', 'medio': 'warning', 'difícil': 'error' }
  return map[diff] || 'grey'
}

// Debounce helper
function debounce(fn, delay) {
  let timeoutId
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

// Debounced save
const debouncedSave = debounce(() => {
  if (authStore.isAuthenticated && sketchesStore.currentSketch) {
    saveCurrentProgress(true)
  }
}, 2000)

function onCanvasChange() {
  if (drawingCanvas.value) {
    canUndo.value = drawingCanvas.value.canUndo()
    canRedo.value = drawingCanvas.value.canRedo()
    
    // Auto-save if logged in
    debouncedSave()
  }
}

// Watch step changes to autosave step index
watch(currentStepIndex, () => {
  if (sketchesStore.currentSketch) {
    debouncedSave()
  }
})

function triggerUndo() { drawingCanvas.value?.undo() }
function triggerRedo() { drawingCanvas.value?.redo() }
function triggerClear() { drawingCanvas.value?.clear() }
function triggerClearSketch() { drawingCanvas.value?.clearSketchLines() }

const isSaving = ref(false)
async function saveCurrentProgress(isAutoSave = false) {
  if (!drawingCanvas.value || !sketchesStore.currentSketch) return
  
  // Bloquear guardado en la nube para invitados
  if (!authStore.isAuthenticated) {
    if (!isAutoSave) {
      alert('¡Crea tu perfil o inicia sesión para guardar tus dibujos y no perderlos! ✨')
      router.push('/login')
    }
    return
  }

  isSaving.value = true
  
  try {
    const strokes = drawingCanvas.value.getJsonData()
    // Append current step to user_data to restore it later
    strokes.saved_step_index = currentStepIndex.value
    
    const success = await sketchesStore.saveProgress(sketchesStore.currentSketch.id, strokes)
    if (success && !isAutoSave) {
      alert('¡Progreso guardado correctamente!')
    }
  } catch (e) {
    console.error(e)
  } finally {
    isSaving.value = false
  }
}

function downloadDrawing() {
  if (!drawingCanvas.value) return
  const dataUrl = drawingCanvas.value.getImageDataUrl()
  if (!dataUrl) return

  const link = document.createElement('a')
  link.download = `creativakids-boceto-${Date.now()}.png`
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function printDrawing() {
  if (!drawingCanvas.value) return
  const dataUrl = drawingCanvas.value.getImageDataUrl()
  if (!dataUrl) return

  const windowContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Imprimir Dibujo — CreativaKids</title>
        <style>
          body {
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: #fff;
          }
          img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" />
        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => { window.close(); }, 500);
          };
        <\/script>
      </body>
    </html>
  `

  const printWin = window.open('', '', 'width=800,height=600')
  if (printWin) {
    printWin.document.open()
    printWin.document.write(windowContent)
    printWin.document.close()
  }
}

onUnmounted(() => {
  sketchesStore.currentSketch = null
})
</script>

<style scoped>
.gap-4 { gap: 16px; }

.toolbar-container {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}
</style>
