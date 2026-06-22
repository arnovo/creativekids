<template>
  <v-container fluid class="pa-4 pa-md-6 fill-height align-start bg-grey-lighten-4">
    
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
          class="note-card rounded-xl pa-4"
          elevation="2"
          hover
          @click="openEditor(note)"
        >
          <div class="d-flex justify-space-between align-start mb-2">
            <h3 class="text-h6 font-weight-bold" style="color: rgba(0,0,0,0.8); line-height: 1.2;">
              {{ note.title }}
            </h3>
            <v-icon v-if="note.is_pinned" color="orange" size="20">mdi-pin</v-icon>
          </div>
          
          <p class="text-body-2 mb-4 text-truncate-3" style="color: rgba(0,0,0,0.6); white-space: pre-wrap;">
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

          <v-btn color="primary" variant="flat" class="ml-2 rounded-pill font-weight-bold" @click="saveNote" :loading="isSaving">
            Guardar
          </v-btn>
        </v-toolbar>

        <!-- Modal Content (Hybrid Text + Canvas) -->
        <div class="fill-height position-relative overflow-hidden notebook-container">
          
          <!-- Text Layer (Underneath Canvas) -->
          <v-textarea
            v-model="editingNote.content"
            placeholder="Escribe tus ideas aquí con el teclado..."
            variant="plain"
            auto-grow
            hide-details
            :readonly="isDrawingMode"
            class="pa-4 text-layer text-body-2"
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
                <v-btn :value="false" prepend-icon="mdi-keyboard-outline" class="font-weight-bold rounded-pill text-caption px-4">
                  Teclado
                </v-btn>
                <v-btn :value="true" prepend-icon="mdi-pen" class="font-weight-bold rounded-pill text-caption px-4">
                  Lápiz
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
import { ref, reactive, onMounted } from 'vue'
import { useNotesStore } from '@/stores/notes'
import DrawingCanvas from '@/components/DrawingCanvas.vue'
import CanvasToolbar from '@/components/CanvasToolbar.vue'

const notesStore = useNotesStore()

// State
const activeCategory = ref(null)
const editorDialog = ref(false)
const isSaving = ref(false)
const isDrawingMode = ref(false)
const noteCanvas = ref(null)

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
  is_pinned: false
})

const brushSettings = reactive({ color: '#1A237E', width: 3, tool: 'brush' }) // Azul escolar fino

// Lifecycle
onMounted(async () => {
  await notesStore.fetchCategories()
  await notesStore.fetchNotes()
})

// Methods
function filterByCategory(id) {
  activeCategory.value = id
  notesStore.fetchNotes(id)
}

function openEditor(note = null) {
  if (note) {
    editingNote.id = note.id
    editingNote.title = note.title
    editingNote.content = note.content
    editingNote.strokes = note.strokes ? (typeof note.strokes === 'string' ? JSON.parse(note.strokes) : note.strokes) : null
    editingNote.category_id = note.category_id
    editingNote.color = note.color
    editingNote.is_pinned = note.is_pinned
  } else {
    editingNote.id = null
    editingNote.title = ''
    editingNote.content = ''
    editingNote.strokes = null
    editingNote.category_id = activeCategory.value
    editingNote.color = '#ffffff'
    editingNote.is_pinned = false
  }
  isDrawingMode.value = false
  editorDialog.value = true
}

async function saveNote() {
  isSaving.value = true
  try {
    // Get latest drawing strokes from canvas
    if (noteCanvas.value) {
      const strokesJson = noteCanvas.value.getJsonData()
      // Only save if there's actual drawing data (not just empty canvas)
      editingNote.strokes = strokesJson?.objects?.length > 0 ? strokesJson : null
    }

    await notesStore.saveNote({ ...editingNote })
    editorDialog.value = false
  } finally {
    isSaving.value = false
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
    await notesStore.fetchNotes(cat.id)
  } finally {
    isCreatingCat.value = false
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
  background-image: 
    linear-gradient(90deg, transparent 59px, #ffa6a6 59px, #ffa6a6 61px, transparent 61px), 
    linear-gradient(#e4e1db 1px, transparent 1px);
  background-size: 100% 100%, 100% 24px;
  background-position: 0 0;
}

/* Align text to sit perfectly on top of notebook lines */
.text-layer :deep(textarea) {
  line-height: 24px !important;
  font-size: 14px !important;
  font-family: 'Nunito', 'Nunito Sans', sans-serif;
  color: rgba(0,0,0,0.8);
  padding-left: 70px !important; /* Move text past vertical pink margin */
  padding-top: 6px !important; /* Fine tune first line offset */
  padding-bottom: 80px !important;
}

.toolbar-container {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}
</style>
