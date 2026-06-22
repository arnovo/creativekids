<template>
  <v-container fluid class="pa-4 pa-md-6 fill-height bg-grey-lighten-4">
    <v-card class="fill-height w-100 rounded-xl d-flex flex-column" elevation="2">
      <!-- Toolbar -->
      <v-toolbar color="surface" flat class="border-b px-4">
        <v-icon color="primary" class="mr-3">mdi-palette-swatch</v-icon>
        <v-toolbar-title class="font-weight-bold text-primary">Mis Dibujos Libres</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" @click="createNewCanvas">
          Nuevo Lienzo
        </v-btn>
      </v-toolbar>

      <!-- Content -->
      <div class="flex-grow-1 overflow-y-auto pa-6">
        <div v-if="freeDrawingsStore.isLoading" class="d-flex justify-center mt-12">
          <v-progress-circular indeterminate color="primary" size="48"></v-progress-circular>
        </div>

        <v-row v-else-if="freeDrawingsStore.drawings.length > 0">
          <v-col v-for="drawing in freeDrawingsStore.drawings" :key="drawing.id" cols="12" sm="6" md="4" lg="3">
            <v-card class="rounded-xl h-100 d-flex flex-column" elevation="3" hover @click="openCanvas(drawing.id)">
              <div class="drawing-preview flex-grow-1 d-flex align-center justify-center bg-grey-lighten-2" :style="{ backgroundColor: drawing.background_color || '#ffffff' }">
                <v-icon size="48" color="grey-lighten-1">mdi-image-outline</v-icon>
              </div>
              <v-card-text class="d-flex justify-space-between align-center bg-white">
                <div class="text-truncate font-weight-bold flex-grow-1">{{ drawing.title || 'Sin Título' }}</div>
                <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click.stop="deleteCanvas(drawing.id)"></v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <div v-else class="h-100 d-flex flex-column align-center justify-center text-center text-grey-darken-1 py-12">
          <v-icon size="64" class="mb-4">mdi-palette-outline</v-icon>
          <h3 class="text-h5 font-weight-bold mb-2">Aún no tienes dibujos libres</h3>
          <p>Pulsa en "Nuevo Lienzo" para empezar a crear obras de arte desde cero.</p>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFreeDrawingsStore } from '@/stores/freeDrawings'

const router = useRouter()
const freeDrawingsStore = useFreeDrawingsStore()

onMounted(() => {
  freeDrawingsStore.fetchDrawings()
})

async function createNewCanvas() {
  const newCanvas = await freeDrawingsStore.createDrawing({
    title: 'Nuevo Dibujo',
    background_color: '#ffffff',
    strokes: null
  })
  if (newCanvas) {
    router.push({ name: 'free-canvas', params: { id: newCanvas.id } })
  }
}

function openCanvas(id) {
  router.push({ name: 'free-canvas', params: { id } })
}

async function deleteCanvas(id) {
  if (confirm('¿Estás seguro de que quieres borrar este dibujo para siempre?')) {
    await freeDrawingsStore.deleteDrawing(id)
  }
}
</script>

<style scoped>
.drawing-preview {
  min-height: 200px;
  background-color: white;
}
</style>
