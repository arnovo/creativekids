<template>
  <div class="canvas-container" ref="containerRef">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, shallowRef } from 'vue'
import * as fabric from 'fabric'
import { createFloodFillImage } from '@/utils/floodFill'

const props = defineProps({
  width: { type: [Number, String], default: '100%' },
  height: { type: [Number, String], default: '100%' },
  brushColor: { type: String, default: '#000000' },
  brushWidth: { type: Number, default: 5 },
  tool: { type: String, default: 'brush' }, // 'brush', 'marker', 'eraser', 'fill'
  isDrawingMode: { type: Boolean, default: true },
  initialData: { type: Object, default: null }, // JSON to load (for notes)
})

const emit = defineEmits(['canvas-ready', 'change'])

const containerRef = ref(null)
const canvasRef = ref(null)
const fabricCanvas = shallowRef(null)
let svgOverlayObj = null;

// History for Undo/Redo
const history = ref([])
const historyIndex = ref(-1)
let isHistoryAction = false

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (fabricCanvas.value) {
    fabricCanvas.value.dispose()
  }
})

function initCanvas() {
  const container = containerRef.value
  const { clientWidth, clientHeight } = container

  fabricCanvas.value = new fabric.Canvas(canvasRef.value, {
    width: clientWidth,
    height: clientHeight,
    isDrawingMode: props.isDrawingMode,
    backgroundColor: 'transparent',
    selection: false,
  })

  // Configure default brush
  updateBrush()

  // Load initial data if provided
  if (props.initialData) {
    fabricCanvas.value.loadFromJSON(props.initialData, () => {
      fabricCanvas.value.renderAll()
      saveHistory()
    })
  } else {
    saveHistory() // Initial blank state
  }

  // Listen for changes
  fabricCanvas.value.on('path:created', (e) => {
    if (e.path) {
      if (props.tool === 'eraser') {
        // True eraser: punches a transparent hole in the canvas
        e.path.set({ globalCompositeOperation: 'destination-out', opacity: 1 });
      }
      // Ensure the coloring outline (SVG) always stays on top of new strokes
      if (svgOverlayObj) {
        fabricCanvas.value.bringObjectToFront(svgOverlayObj);
      }
    }
    saveHistory()
    emit('change', getJsonData())
  })

  // Listen for flood fill clicks
  fabricCanvas.value.on('mouse:down', async (e) => {
    if (props.tool === 'fill') {
      const canvasEl = fabricCanvas.value.lowerCanvasEl || fabricCanvas.value.getElement();
      // En Fabric v6/v7 la coordenada lógica viene directamente en e.scenePoint
      const pointer = e.scenePoint || e.pointer || { x: e.e.offsetX, y: e.e.offsetY };
      
      const pixelX = Math.floor(pointer.x * (canvasEl.width / fabricCanvas.value.width));
      const pixelY = Math.floor(pointer.y * (canvasEl.height / fabricCanvas.value.height));
      
      const dataUrl = await createFloodFillImage(canvasEl, pixelX, pixelY, props.brushColor);
      
      if (dataUrl) {
        fabric.Image.fromURL(dataUrl).then(img => {
          img.set({
            left: 0, top: 0,
            originX: 'left', originY: 'top',
            scaleX: fabricCanvas.value.width / canvasEl.width,
            scaleY: fabricCanvas.value.height / canvasEl.height,
            selectable: false, evented: false
          });
          fabricCanvas.value.add(img);
          fabricCanvas.value.sendObjectToBack(img);
          saveHistory();
          emit('change', getJsonData());
        }).catch(err => console.error("Fill error", err));
      }
    }
  });

  fabricCanvas.value.on('object:modified', () => {
    saveHistory()
    emit('change', getJsonData())
  })

  emit('canvas-ready', fabricCanvas.value)
}

function handleResize() {
  if (!fabricCanvas.value || !containerRef.value) return
  
  // Throttle resize for performance
  requestAnimationFrame(() => {
    const { clientWidth, clientHeight } = containerRef.value
    fabricCanvas.value.setDimensions({
      width: clientWidth,
      height: clientHeight
    })
  })
}

function updateBrush() {
  if (!fabricCanvas.value) return
  
  const isDraw = props.isDrawingMode && props.tool !== 'fill';
  fabricCanvas.value.isDrawingMode = isDraw;
  
  if (isDraw) {
    const brush = new fabric.PencilBrush(fabricCanvas.value)
    
    let color = props.brushColor;
    if (props.tool === 'eraser') color = '#FFFFFF';
    else if (props.tool === 'marker') color = color + '80'; // 50% opacity hex
    
    brush.color = color;
    brush.width = props.tool === 'marker' ? props.brushWidth * 2 : props.brushWidth;
    brush.decimate = 2
    fabricCanvas.value.freeDrawingBrush = brush
  }
}

// ─── Watchers for reactive props ──────────────────────────
watch(() => props.brushColor, updateBrush)
watch(() => props.brushWidth, updateBrush)
watch(() => props.tool, updateBrush)
watch(() => props.isDrawingMode, updateBrush)

// ─── Exposed Methods ──────────────────────────────────────

function clear() {
  if (!fabricCanvas.value) return
  fabricCanvas.value.clear()
  fabricCanvas.value.backgroundColor = 'transparent'
  saveHistory()
  emit('change', getJsonData())
}

function undo() {
  if (historyIndex.value > 0) {
    isHistoryAction = true
    historyIndex.value--
    fabricCanvas.value.loadFromJSON(history.value[historyIndex.value], () => {
      fabricCanvas.value.renderAll()
      isHistoryAction = false
      emit('change', getJsonData())
    })
  }
}

function redo() {
  if (historyIndex.value < history.value.length - 1) {
    isHistoryAction = true
    historyIndex.value++
    fabricCanvas.value.loadFromJSON(history.value[historyIndex.value], () => {
      fabricCanvas.value.renderAll()
      isHistoryAction = false
      emit('change', getJsonData())
    })
  }
}

function saveHistory() {
  if (isHistoryAction) return
  
  // Discard future history if we undo and then draw again
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1)
  }
  
  history.value.push(JSON.stringify(fabricCanvas.value.toJSON()))
  historyIndex.value++
  
  // Limit history size to prevent memory leaks
  if (history.value.length > 50) {
    history.value.shift()
    historyIndex.value--
  }
}

function getJsonData() {
  return fabricCanvas.value ? fabricCanvas.value.toJSON() : null
}

function getSvgData() {
  return fabricCanvas.value ? fabricCanvas.value.toSVG() : null
}

function setTraceImage(url) {
  if (!fabricCanvas.value) return
  
  if (!url) {
    fabricCanvas.value.backgroundImage = null
    fabricCanvas.value.renderAll()
    return
  }

  fabric.Image.fromURL(url).then((img) => {
    const canvas = fabricCanvas.value
    const scale = Math.min(
      (canvas.width * 0.8) / img.width,
      (canvas.height * 0.8) / img.height
    )
    
    img.set({
      scaleX: scale,
      scaleY: scale,
      originX: 'center',
      originY: 'center',
      left: canvas.width / 2,
      top: canvas.height / 2,
      opacity: 0.25 // Low opacity for tracing
    })
    
    canvas.backgroundImage = img
    canvas.renderAll()
  }).catch(err => {
    // Fallback for older fabric versions if fromURL doesn't return a promise
    fabric.Image.fromURL(url, (img) => {
      const canvas = fabricCanvas.value
      const scale = Math.min(
        (canvas.width * 0.8) / img.width,
        (canvas.height * 0.8) / img.height
      )
      
      img.set({
        scaleX: scale,
        scaleY: scale,
        originX: 'center',
        originY: 'center',
        left: canvas.width / 2,
        top: canvas.height / 2,
        opacity: 0.25
      })
      
      canvas.backgroundImage = img
      canvas.renderAll()
    })
  })
}

function loadSvg(svgUrl) {
  if (!fabricCanvas.value) return
  
  fabric.loadSVGFromURL(svgUrl).then(({ objects, options }) => {
    const obj = fabric.util.groupSVGElements(objects, options)
    
    // Scale SVG to fit canvas (leave some margin)
    const canvas = fabricCanvas.value
    const scale = Math.min(
      (canvas.width * 0.9) / obj.width,
      (canvas.height * 0.9) / obj.height
    )
    
    obj.set({
      scaleX: scale,
      scaleY: scale,
      originX: 'center',
      originY: 'center',
      left: canvas.width / 2,
      top: canvas.height / 2,
      selectable: false,
      evented: false
    })
    
    if (svgOverlayObj) {
      canvas.remove(svgOverlayObj)
    }
    svgOverlayObj = obj;
    canvas.add(obj);
    canvas.bringObjectToFront(obj);
    
    saveHistory()
  }).catch(err => console.error("Error loading SVG:", err))
}

function toggleTraceVisibility() {
  if (!fabricCanvas.value || !fabricCanvas.value.backgroundImage) return true
  
  const img = fabricCanvas.value.backgroundImage
  img.opacity = img.opacity === 0 ? 0.25 : 0
  fabricCanvas.value.renderAll()
  
  return img.opacity !== 0
}

function clearSketchLines() {
  if (!fabricCanvas.value) return
  const objects = fabricCanvas.value.getObjects()
  let modified = false
  objects.forEach(obj => {
    if (obj.type === 'path' && obj.stroke && obj.stroke.toUpperCase() === '#90CAF9') {
      fabricCanvas.value.remove(obj)
      modified = true
    }
  })
  
  if (modified) {
    fabricCanvas.value.renderAll()
    saveHistory()
    emit('change', getJsonData())
  }
}

defineExpose({
  clear,
  clearSketchLines,
  undo,
  redo,
  getJsonData,
  getSvgData,
  setTraceImage,
  toggleTraceVisibility,
  loadSvg,
  canUndo: () => historyIndex.value > 0,
  canRedo: () => historyIndex.value < history.value.length - 1
})
</script>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  touch-action: none; /* Critical for touch drawing */
}
</style>
