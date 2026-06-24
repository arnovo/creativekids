<template>
  <div class="canvas-wrapper fill-height position-relative bg-grey-lighten-4">
    <!-- Back Button -->
    <v-btn icon color="white" class="back-btn elevation-2" @click="router.push('/lienzo')">
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>

    <DrawingCanvas
      ref="drawingCanvas"
      :brush-color="brushSettings.color"
      :brush-width="brushSettings.width"
      :tool="brushSettings.tool || 'brush'"
      :is-drawing-mode="brushSettings.tool !== 'fill'"
      :initial-data="freeDrawingsStore.currentDrawing?.strokes"
      @change="onCanvasChange"
    />

    <!-- Absolute positioned Toolbar -->
    <div class="toolbar-container">
      <CanvasToolbar
        v-model="brushSettings"
        :can-undo="canUndo"
        :can-redo="canRedo"
        @undo="triggerUndo"
        @redo="triggerRedo"
        @clear="triggerClear"
        @clear-sketch="triggerClearSketch"
        @save="() => saveCurrentProgress(false)"
        @download="downloadDrawing"
        @print="printDrawing"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFreeDrawingsStore } from '@/stores/freeDrawings'
import { useAuthStore } from '@/stores/auth'
import DrawingCanvas from '@/components/DrawingCanvas.vue'
import CanvasToolbar from '@/components/CanvasToolbar.vue'

const route = useRoute()
const router = useRouter()
const freeDrawingsStore = useFreeDrawingsStore()
const authStore = useAuthStore()

const drawingCanvas = ref(null)

const brushSettings = reactive({
  color: '#000000',
  width: 5,
  tool: 'brush'
})

const canUndo = ref(false)
const canRedo = ref(false)

onMounted(async () => {
  if (route.params.id && route.params.id !== 'guest') {
    await freeDrawingsStore.fetchDrawing(route.params.id)
  } else {
    freeDrawingsStore.currentDrawing = {
      id: 'guest',
      title: 'Dibujo de Invitado',
      strokes: null
    }
  }
})

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

// Debounced autosave
const debouncedSave = debounce(() => {
  if (authStore.isAuthenticated && route.params.id !== 'guest') {
    saveCurrentProgress(true)
  }
}, 2000)

function onCanvasChange() {
  if (drawingCanvas.value) {
    canUndo.value = drawingCanvas.value.canUndo()
    canRedo.value = drawingCanvas.value.canRedo()
    
    debouncedSave()
  }
}

function triggerUndo() {
  if (drawingCanvas.value) drawingCanvas.value.undo()
}

function triggerRedo() {
  if (drawingCanvas.value) drawingCanvas.value.redo()
}

function triggerClear() {
  if (drawingCanvas.value) drawingCanvas.value.clear()
}

function triggerClearSketch() {
  if (drawingCanvas.value) drawingCanvas.value.clearSketchLines()
}

const isSaving = ref(false)
async function saveCurrentProgress(isAutoSave = false) {
  if (!drawingCanvas.value || !freeDrawingsStore.currentDrawing) return

  // Bloquear guardado en la nube para invitados
  if (!authStore.isAuthenticated || route.params.id === 'guest') {
    if (!isAutoSave) {
      alert('¡Crea tu perfil o inicia sesión para guardar tus dibujos en tu galería libre! ✨')
      router.push('/login')
    }
    return
  }

  isSaving.value = true
  try {
    const strokes = drawingCanvas.value.getJsonData()
    const success = await freeDrawingsStore.updateDrawing(freeDrawingsStore.currentDrawing.id, { strokes })
    if (success && !isAutoSave) {
      alert('¡Lienzo guardado en tu galería libre!')
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
  link.download = `creativakids-dibujo-libre-${Date.now()}.png`
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
</script>

<style scoped>
.canvas-wrapper {
  overflow: hidden;
  touch-action: none;
}

.toolbar-container {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.back-btn {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 10;
}
</style>
