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
      <CanvasToolbar
        v-model="brushSettings"
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
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFreeDrawingsStore } from '@/stores/freeDrawings'
import DrawingCanvas from '@/components/DrawingCanvas.vue'
import CanvasToolbar from '@/components/CanvasToolbar.vue'

const route = useRoute()
const router = useRouter()
const freeDrawingsStore = useFreeDrawingsStore()

const drawingCanvas = ref(null)

const brushSettings = reactive({
  color: '#000000',
  width: 5,
  tool: 'brush'
})

const canUndo = ref(false)
const canRedo = ref(false)

onMounted(async () => {
  if (route.params.id) {
    await freeDrawingsStore.fetchDrawing(route.params.id)
  }
})

function onCanvasChange() {
  if (drawingCanvas.value) {
    canUndo.value = drawingCanvas.value.canUndo()
    canRedo.value = drawingCanvas.value.canRedo()
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
async function saveCurrentProgress() {
  if (!drawingCanvas.value || !freeDrawingsStore.currentDrawing) return
  isSaving.value = true
  
  try {
    const strokes = drawingCanvas.value.getJsonData()
    const success = await freeDrawingsStore.updateDrawing(freeDrawingsStore.currentDrawing.id, { strokes })
    if (success) {
      alert('¡Lienzo guardado en tu galería libre!')
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
.canvas-wrapper {
  overflow: hidden;
  /* Prevent scrolling when touching canvas area */
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
