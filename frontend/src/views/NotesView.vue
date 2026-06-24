<template>
  <v-container fluid class="pa-4 pa-md-6 fill-height align-start bg-grey-lighten-4">
    
    <!-- Authenticated Notes Gallery -->
    <template v-if="authStore.isAuthenticated">
      <!-- Top actions -->
      <div class="d-flex justify-space-between align-center w-100 mb-6">
        <div class="d-flex align-center gap-2 overflow-x-auto pb-2">
          <v-chip
            :variant="activeCategory === null ? 'flat' : 'tonal'"
            color="primary"
            @click="filterByCategory(null)"
          >
            Todas
          </v-chip>
          <v-chip
            v-for="cat in notesStore.categories"
            :key="cat.id"
            :variant="activeCategory === cat.id ? 'flat' : 'tonal'"
            :style="{ backgroundColor: activeCategory === cat.id ? cat.color : 'transparent', color: '#333' }"
            @click="filterByCategory(cat.id)"
          >
            <v-icon start size="16">mdi-{{ cat.icon }}</v-icon>
            {{ cat.name }}
          </v-chip>

          <v-btn icon size="small" variant="tonal" class="ml-2" @click="categoryDialog = true">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>

        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          elevation="2"
          class="rounded-pill px-6"
          @click="openEditor(null)"
        >
          Nueva Nota
        </v-btn>
      </div>

      <!-- Notes Grid -->
      <v-row v-if="notesStore.isLoading">
        <v-col cols="12" class="d-flex justify-center mt-12">
          <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
        </v-col>
      </v-row>

      <v-row v-else-if="notesStore.notes.length === 0">
        <v-col cols="12" class="d-flex flex-column align-center justify-center mt-12 text-grey">
          <v-icon size="64" class="mb-4">mdi-note-off-outline</v-icon>
          <h3 class="text-h5">No hay notas aquí</h3>
        </v-col>
      </v-row>

      <v-row v-else class="masonry-grid">
        <v-col
          v-for="note in notesStore.notes"
          :key="note.id"
          cols="12" sm="6" md="4" lg="3"
        >
          <v-card
            :color="note.color"
            class="note-card rounded-xl pa-4 position-relative"
            elevation="2"
            hover
            @click="openEditor(note)"
          >
            <div class="d-flex justify-space-between align-start mb-2 pr-6">
              <h3 class="text-h6 font-weight-bold" style="color: rgba(0,0,0,0.8); line-height: 1.2;">
                {{ note.title }}
              </h3>
              <v-icon v-if="note.is_pinned" color="orange" size="20">mdi-pin</v-icon>
            </div>
            
            <!-- Quick delete button at top right -->
            <v-btn
              icon="mdi-delete"
              variant="text"
              color="grey-darken-1"
              size="x-small"
              class="position-absolute"
              style="top: 8px; right: 8px; z-index: 5;"
              @click.stop="quickDeleteNote(note)"
              title="Borrar nota"
            ></v-btn>
            
            <p 
              class="text-body-2 mb-4 text-truncate-3" 
              style="color: rgba(0,0,0,0.6); white-space: pre-wrap;"
              :class="[
                {
                  'text-bold': note.text_style?.includes('bold'),
                  'text-italic': note.text_style ? note.text_style.includes('italic') : true,
                  'text-underline': note.text_style?.includes('underline')
                },
                `note-size-${note.text_style?.find(s => s.startsWith('size-'))?.replace('size-', '') || 'large'}`
              ]"
            >
              {{ note.content }}
            </p>

            <div class="d-flex justify-space-between align-end mt-auto">
              <v-chip
                v-if="note.category_id"
                size="x-small"
                :color="getCategoryColor(note.category_id)"
                variant="flat"
                class="font-weight-bold text-black"
              >
                <v-icon start size="12">mdi-{{ getCategoryIcon(note.category_id) }}</v-icon>
                {{ getCategoryName(note.category_id) }}
              </v-chip>
              <span v-else></span>

              <!-- If note has strokes (drawings), show a small brush icon to indicate it -->
              <v-icon v-if="note.strokes" size="16" color="grey-darken-1">mdi-draw</v-icon>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Guest Promo Screen -->
    <v-card v-else class="fill-height w-100 rounded-xl d-flex flex-column align-center justify-center text-center pa-8" elevation="2" style="background: linear-gradient(135deg, #eef7ff 0%, #fff 100%);">
      <div class="guest-container">
        <v-icon size="96" color="primary" class="mb-4 animate-bounce">mdi-notebook-edit-outline</v-icon>
        <h2 class="text-h4 font-weight-black text-primary mb-3">¡Tu Bloc de Notas Secreto! 📚</h2>
        <p class="text-subtitle-1 text-grey-darken-1 mb-8 max-width-500">
          Crea tu perfil o inicia sesión para crear notas secretas, escribir tus ideas y hacer dibujos divertidos sobre ellas. ¡Nunca se perderán! ✨
        </p>
        <div class="d-flex justify-center gap-4">
          <v-btn
            color="primary"
            variant="flat"
            size="large"
            prepend-icon="mdi-account-circle"
            class="rounded-pill font-weight-bold px-8 elevation-3"
            @click="router.push('/login')"
          >
            Iniciar Sesión / Crear Perfil
          </v-btn>
        </div>
      </div>
    </v-card>

    <!-- Editor Modal -->
    <v-dialog v-model="editorDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card class="bg-grey-lighten-4">
        
        <!-- Modal Toolbar -->
        <v-toolbar :color="editingNote.color || 'white'" elevation="1" class="px-2">
          <v-btn icon @click="editorDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          
          <v-toolbar-title class="px-0">
            <v-text-field
              v-model="editingNote.title"
              placeholder="Título de la nota..."
              variant="plain"
              hide-details
              density="compact"
              class="text-h6 font-weight-bold"
            ></v-text-field>
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon @click="editingNote.is_pinned = !editingNote.is_pinned">
            <v-icon :color="editingNote.is_pinned ? 'orange' : 'grey'">mdi-pin</v-icon>
          </v-btn>

          <v-btn
            v-if="editingNote.id"
            icon color="error"
            @click="deleteNote"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>

          <v-btn color="primary" variant="flat" class="ml-2 rounded-pill font-weight-bold" @click="() => saveNote(false)" :loading="isSaving">
            Guardar
          </v-btn>
        </v-toolbar>

        <!-- Modal Content (Hybrid Text + Canvas) -->
        <div class="fill-height position-relative overflow-hidden notebook-container" :class="`note-size-${activeTextSize}`">
          
          <!-- Text Layer (Underneath Canvas) -->
          <v-textarea
            v-model="editingNote.content"
            placeholder="Escribe tus ideas aquí con el teclado..."
            variant="plain"
            auto-grow
            hide-details
            :readonly="isDrawingMode"
            class="pa-4 text-layer text-body-2"
            :class="[
              {
                'text-bold': activeTextStyles.includes('bold'),
                'text-italic': activeTextStyles.includes('italic'),
                'text-underline': activeTextStyles.includes('underline')
              },
              `note-size-${activeTextSize}`
            ]"
            style="position: absolute; width: 100%; height: 100%; z-index: 1;"
            :style="{ pointerEvents: isDrawingMode ? 'none' : 'auto' }"
          ></v-textarea>

          <!-- Drawing Layer (Transparent over Text) -->
          <div style="position: absolute; width: 100%; height: 100%; z-index: 2;" :style="{ pointerEvents: isDrawingMode ? 'auto' : 'none' }">
            <DrawingCanvas
              ref="noteCanvas"
              :brush-color="brushSettings.color"
              :brush-width="brushSettings.width"
              :tool="brushSettings.tool"
              :is-drawing-mode="isDrawingMode && brushSettings.tool !== 'fill'"
              :initial-data="editingNote.strokes"
              @change="onCanvasChange"
            />
          </div>

          <!-- Color/Category Picker Bottom Bar -->
          <v-sheet class="position-absolute w-100 pa-3 d-flex align-center justify-space-between bg-white border-t" style="bottom: 0; z-index: 10; padding-bottom: calc(12px + env(safe-area-inset-bottom)) !important;">
            
            <div class="d-flex align-center gap-2">
              <v-btn-toggle
                v-model="isDrawingMode"
                mandatory
                color="primary"
                variant="flat"
                density="compact"
                class="rounded-pill mr-2 bg-grey-lighten-3"
              >
                <v-btn :value="false" prepend-icon="mdi-keyboard-outline" class="font-weight-bold rounded-pill text-caption px-4" title="Escribir con teclado">
                  Teclado
                </v-btn>
                <v-btn :value="true" prepend-icon="mdi-pen" class="font-weight-bold rounded-pill text-caption px-4" title="Escribir a mano">
                  Lápiz
                </v-btn>
              </v-btn-toggle>
              
              <!-- Text Styling Buttons (only visible in Keyboard mode) -->
              <v-btn-toggle
                v-if="!isDrawingMode"
                v-model="activeTextStyles"
                multiple
                color="primary"
                variant="tonal"
                density="compact"
                class="rounded-pill mr-2 bg-grey-lighten-4"
                @update:model-value="onTextStyleChange"
              >
                <v-btn value="bold" icon="mdi-format-bold" title="Negrita" size="28" class="rounded-pill"></v-btn>
                <v-btn value="italic" icon="mdi-format-italic" title="Cursiva" size="28" class="rounded-pill"></v-btn>
                <v-btn value="underline" icon="mdi-format-underline" title="Subrayado" size="28" class="rounded-pill"></v-btn>
              </v-btn-toggle>

              <!-- Text Sizing Buttons (only visible in Keyboard mode) -->
              <v-btn-toggle
                v-if="!isDrawingMode"
                v-model="activeTextSize"
                mandatory
                color="primary"
                variant="tonal"
                density="compact"
                class="rounded-pill mr-2 bg-grey-lighten-4"
                @update:model-value="onTextSizeChange"
              >
                <v-btn value="small" title="Texto Pequeño" size="28" class="rounded-pill">
                  <span style="font-size: 10px; font-weight: bold;">A</span>
                </v-btn>
                <v-btn value="medium" title="Texto Mediano" size="28" class="rounded-pill">
                  <span style="font-size: 13px; font-weight: bold;">A</span>
                </v-btn>
                <v-btn value="large" title="Texto Grande" size="28" class="rounded-pill">
                  <span style="font-size: 16px; font-weight: bold;">A</span>
                </v-btn>
              </v-btn-toggle>
              
              <v-divider vertical class="mx-1"></v-divider>
              
              <!-- Background Color Selection -->
              <v-btn
                v-for="color in bgColors"
                :key="color"
                icon
                size="24"
                :color="color"
                class="border"
                @click="editingNote.color = color"
              >
                <v-icon v-if="editingNote.color === color" size="10">mdi-check</v-icon>
              </v-btn>
            </div>

            <v-select
              v-model="editingNote.category_id"
              :items="notesStore.categories"
              item-title="name"
              item-value="id"
              placeholder="Categoría"
              variant="outlined"
              density="compact"
              hide-details
              style="max-width: 130px;"
              class="text-caption"
            ></v-select>

          </v-sheet>

          <!-- Floating Canvas Toolbar (only visible when drawing) -->
          <div v-if="isDrawingMode" class="toolbar-container">
            <CanvasToolbar
              :model-value="brushSettings"
              @update:model-value="val => Object.assign(brushSettings, val)"
              :can-undo="true"
              :can-redo="true"
              @undo="noteCanvas?.undo()"
              @redo="noteCanvas?.redo()"
              @clear="noteCanvas?.clear()"
              @clear-sketch="noteCanvas?.clearSketchLines()"
              @download="downloadDrawing"
              @print="printDrawing"
            />
          </div>

        </div>
      </v-card>
    </v-dialog>

    <!-- New Category Dialog -->
    <v-dialog v-model="categoryDialog" max-width="360">
      <v-card class="rounded-xl pa-2">
        <v-card-title class="font-weight-bold text-subtitle-1">Nueva Categoría</v-card-title>
        <v-card-text class="pa-2">
          <v-text-field
            v-model="newCategory.name"
            label="Nombre"
            variant="outlined"
            density="compact"
            class="mb-3"
            hide-details
          ></v-text-field>
          <div class="text-caption mb-2 font-weight-medium">Color:</div>
          <div class="d-flex gap-2">
            <v-btn
              v-for="c in catColors" :key="c"
              icon size="x-small" :color="c"
              elevation="0"
              class="border"
              @click="newCategory.color = c"
            >
              <v-icon v-if="newCategory.color === c" size="12">mdi-check</v-icon>
            </v-btn>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" size="small" @click="categoryDialog = false">Cancelar</v-btn>
          <v-btn color="primary" variant="flat" size="small" class="rounded-pill px-4" @click="createCategory" :loading="isCreatingCat" :disabled="!newCategory.name">Crear</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes'
import { useAuthStore } from '@/stores/auth'
import DrawingCanvas from '@/components/DrawingCanvas.vue'
import CanvasToolbar from '@/components/CanvasToolbar.vue'

const router = useRouter()
const notesStore = useNotesStore()
const authStore = useAuthStore()

// State
const activeCategory = ref(null)
const editorDialog = ref(false)
const isSaving = ref(false)
const isDrawingMode = ref(false)
const noteCanvas = ref(null)

// Text style and size states (default is cursive/large)
const activeTextStyles = ref(JSON.parse(localStorage.getItem('creativakids_text_style')) || ['italic'])
const activeTextSize = ref(localStorage.getItem('creativakids_text_size') || 'large')

// Category State
const categoryDialog = ref(false)
const isCreatingCat = ref(false)
const newCategory = reactive({ name: '', color: '#ffecb3', icon: 'folder' })
const catColors = ['#ffecb3', '#f8bbd0', '#b2ebf2', '#c8e6c9', '#e1bee7']

const bgColors = ['#ffffff', '#fff4cc', '#d5e3ff', '#d3f9d8', '#fce4ec']

const editingNote = reactive({
  id: null,
  title: '',
  content: '',
  strokes: null,
  category_id: null,
  color: '#ffffff',
  is_pinned: false,
  text_style: null
})

const brushSettings = reactive({ color: '#1A237E', width: 3, tool: 'brush' }) // Azul escolar fino

// Lifecycle
onMounted(async () => {
  await notesStore.fetchCategories()
  if (authStore.isAuthenticated) {
    await notesStore.fetchNotes()
  }
})

// Methods
function filterByCategory(id) {
  activeCategory.value = id
  if (authStore.isAuthenticated) {
    notesStore.fetchNotes(id)
  }
}

let isPopulating = false

function openEditor(note = null) {
  isPopulating = true
  if (note) {
    editingNote.id = note.id
    editingNote.title = note.title
    editingNote.content = note.content
    editingNote.strokes = note.strokes ? (typeof note.strokes === 'string' ? JSON.parse(note.strokes) : note.strokes) : null
    editingNote.category_id = note.category_id
    editingNote.color = note.color
    editingNote.is_pinned = note.is_pinned
    
    // Load note's specific text style (default to italic if null)
    activeTextStyles.value = note.text_style?.filter(s => !s.startsWith('size-')) || ['italic']
    
    // Load size
    const sizeStyle = note.text_style?.find(s => s.startsWith('size-'))
    activeTextSize.value = sizeStyle ? sizeStyle.replace('size-', '') : 'large'
  } else {
    editingNote.id = null
    editingNote.title = ''
    editingNote.content = ''
    editingNote.strokes = null
    editingNote.category_id = activeCategory.value
    editingNote.color = '#ffffff'
    editingNote.is_pinned = false
    
    // For new notes, inherit last used values from localStorage
    activeTextStyles.value = JSON.parse(localStorage.getItem('creativakids_text_style')) || ['italic']
    activeTextSize.value = localStorage.getItem('creativakids_text_size') || 'large'
  }
  isDrawingMode.value = false
  editorDialog.value = true

  setTimeout(() => {
    isPopulating = false
  }, 100)
}

async function saveNote(isAutoSave = false) {
  if (!authStore.isAuthenticated) {
    if (!isAutoSave) {
      alert('¡Inicia sesión o regístrate para guardar tus notas secretas! ✨')
      router.push('/login')
    }
    return
  }

  isSaving.value = true
  try {
    // Get latest drawing strokes from canvas
    if (noteCanvas.value) {
      const strokesJson = noteCanvas.value.getJsonData()
      editingNote.strokes = strokesJson?.objects?.length > 0 ? strokesJson : null
    }

    // Save active text styles combined with current size class
    const finalStyles = activeTextStyles.value.filter(s => !s.startsWith('size-'))
    finalStyles.push(`size-${activeTextSize.value}`)
    editingNote.text_style = finalStyles

    const saved = await notesStore.saveNote({ ...editingNote })
    if (saved && !editingNote.id) {
      editingNote.id = saved.id
    }
    
    if (!isAutoSave) {
      editorDialog.value = false
    }
  } finally {
    isSaving.value = false
  }
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

// Debounced autosave
const debouncedSave = debounce(() => {
  if (!editorDialog.value || !authStore.isAuthenticated || isPopulating) return
  saveNote(true)
}, 2000)

function onCanvasChange() {
  debouncedSave()
}

// Watchers for note fields and metadata to trigger autosave
watch(
  () => [
    editingNote.title,
    editingNote.content,
    editingNote.category_id,
    editingNote.color,
    editingNote.is_pinned
  ],
  () => {
    if (editorDialog.value) {
      debouncedSave()
    }
  }
)

watch(
  () => [activeTextStyles.value, activeTextSize.value],
  () => {
    if (editorDialog.value) {
      debouncedSave()
    }
  },
  { deep: true }
)

function onTextStyleChange(val) {
  localStorage.setItem('creativakids_text_style', JSON.stringify(val))
}

function onTextSizeChange(val) {
  localStorage.setItem('creativakids_text_size', val)
}

async function quickDeleteNote(note) {
  if (confirm(`¿Seguro que quieres borrar la nota "${note.title || 'sin título'}"?`)) {
    await notesStore.deleteNote(note.id)
  }
}

async function deleteNote() {
  if (confirm('¿Seguro que quieres borrar esta nota?')) {
    await notesStore.deleteNote(editingNote.id)
    editorDialog.value = false
  }
}

async function createCategory() {
  if (!newCategory.name) return
  isCreatingCat.value = true
  try {
    const cat = await notesStore.createCategory({ ...newCategory })
    categoryDialog.value = false
    newCategory.name = ''
    activeCategory.value = cat.id // Auto-select new category
    if (authStore.isAuthenticated) {
      await notesStore.fetchNotes(cat.id)
    }
  } finally {
    isCreatingCat.value = false
  }
}

function downloadDrawing() {
  if (!noteCanvas.value) return
  const dataUrl = noteCanvas.value.getImageDataUrl()
  if (!dataUrl) return

  const link = document.createElement('a')
  link.download = `creativakids-nota-dibujo-${Date.now()}.png`
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function printDrawing() {
  if (!noteCanvas.value) return
  const dataUrl = noteCanvas.value.getImageDataUrl()
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

// Helpers
function getCategoryInfo(id) {
  return notesStore.categories.find(c => c.id === id) || {}
}
function getCategoryName(id) { return getCategoryInfo(id).name || '' }
function getCategoryColor(id) { return getCategoryInfo(id).color || '#ccc' }
function getCategoryIcon(id) { return getCategoryInfo(id).icon || 'folder' }
</script>

<style scoped>
.gap-2 { gap: 8px; }

.note-card {
  min-height: 120px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
}

.note-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important;
}

.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}

/* Notebook school lines and pink margin - scaled for tablets */
.notebook-container {
  background-color: #fdfbf7 !important;
  background-position: 0 0;
}

/* Scaling line spacing */
.notebook-container.note-size-small {
  background-image: 
    linear-gradient(90deg, transparent 59px, #ffa6a6 59px, #ffa6a6 61px, transparent 61px), 
    linear-gradient(#e4e1db 1px, transparent 1px);
  background-size: 100% 100%, 100% 20px;
}
.notebook-container.note-size-medium {
  background-image: 
    linear-gradient(90deg, transparent 59px, #ffa6a6 59px, #ffa6a6 61px, transparent 61px), 
    linear-gradient(#e4e1db 1px, transparent 1px);
  background-size: 100% 100%, 100% 24px;
}
.notebook-container.note-size-large {
  background-image: 
    linear-gradient(90deg, transparent 59px, #ffa6a6 59px, #ffa6a6 61px, transparent 61px), 
    linear-gradient(#e4e1db 1px, transparent 1px);
  background-size: 100% 100%, 100% 32px;
}

/* Align text to sit perfectly on top of notebook lines */
.text-layer :deep(textarea) {
  font-family: 'Nunito', 'Nunito Sans', sans-serif;
  color: rgba(0,0,0,0.8);
  padding-left: 70px !important; /* Move text past vertical pink margin */
  padding-bottom: 80px !important;
}

/* Scaling text sizes and alignment */
.text-layer.note-size-small :deep(textarea), .note-size-small {
  line-height: 20px !important;
  font-size: 12px !important;
}
.text-layer.note-size-small :deep(textarea) {
  padding-top: 4px !important;
}

.text-layer.note-size-medium :deep(textarea), .note-size-medium {
  line-height: 24px !important;
  font-size: 14px !important;
}
.text-layer.note-size-medium :deep(textarea) {
  padding-top: 6px !important;
}

.text-layer.note-size-large :deep(textarea), .note-size-large {
  line-height: 32px !important;
  font-size: 18px !important;
}
.text-layer.note-size-large :deep(textarea) {
  padding-top: 10px !important;
}

/* Text styling modifiers */
.text-bold, .text-bold :deep(textarea) {
  font-weight: bold !important;
}
.text-italic, .text-italic :deep(textarea) {
  font-style: italic !important;
}
.text-underline, .text-underline :deep(textarea) {
  text-decoration: underline !important;
}

.toolbar-container {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.guest-container {
  max-width: 600px;
}

.max-width-500 {
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

.animate-bounce {
  animation: bounce 2s infinite ease-in-out;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
