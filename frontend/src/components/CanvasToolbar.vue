<template>
  <v-card class="toolbar-card rounded-pill px-3 py-1 d-flex align-center gap-2" elevation="4">
    <!-- Tool Selector -->
    <div class="d-flex align-center gap-1">
      <v-btn icon size="x-small" :variant="modelValue.tool === 'brush' ? 'flat' : 'text'" :color="modelValue.tool === 'brush' ? 'primary' : 'default'" @click="updateSettings('tool', 'brush')">
        <v-tooltip activator="parent" location="top">Pincel</v-tooltip>
        <v-icon size="18">mdi-brush</v-icon>
      </v-btn>
      <v-btn icon size="x-small" :variant="modelValue.tool === 'marker' ? 'flat' : 'text'" :color="modelValue.tool === 'marker' ? 'primary' : 'default'" @click="updateSettings('tool', 'marker')">
        <v-tooltip activator="parent" location="top">Rotulador</v-tooltip>
        <v-icon size="18">mdi-marker</v-icon>
      </v-btn>
      <v-btn icon size="x-small" :variant="modelValue.tool === 'fill' ? 'flat' : 'text'" :color="modelValue.tool === 'fill' ? 'primary' : 'default'" @click="updateSettings('tool', 'fill')">
        <v-tooltip activator="parent" location="top">Rellenar</v-tooltip>
        <v-icon size="18">mdi-format-color-fill</v-icon>
      </v-btn>
      <v-btn icon size="x-small" :variant="modelValue.tool === 'eraser' ? 'flat' : 'text'" :color="modelValue.tool === 'eraser' ? 'primary' : 'default'" @click="updateSettings('tool', 'eraser')">
        <v-tooltip activator="parent" location="top">Goma</v-tooltip>
        <v-icon size="18">mdi-eraser</v-icon>
      </v-btn>
    </div>

    <v-divider vertical class="mx-1"></v-divider>

    <!-- Color Picker (Quick Palette) -->
    <div class="d-flex align-center gap-1" :style="{ opacity: modelValue.tool === 'eraser' ? 0.5 : 1, pointerEvents: modelValue.tool === 'eraser' ? 'none' : 'auto' }">
      <v-btn
        v-for="c in presetColors"
        :key="c.value"
        icon
        size="x-small"
        :color="c.value"
        class="color-btn"
        :class="{ 'color-btn--active': modelValue.color === c.value }"
        @click="updateSettings('color', c.value)"
      >
        <v-icon v-if="modelValue.color === c.value" size="12" color="white" style="mix-blend-mode: difference;">
          mdi-check
        </v-icon>
      </v-btn>
    </div>

    <v-divider vertical class="mx-1"></v-divider>

    <!-- Brush Width -->
    <div class="d-flex align-center gap-0">
      <v-btn
        icon
        size="x-small"
        variant="text"
        :color="modelValue.width === 2 ? 'primary' : 'default'"
        @click="updateSettings('width', 2)"
      >
        <v-icon size="8">mdi-circle</v-icon>
      </v-btn>
      <v-btn
        icon
        size="x-small"
        variant="text"
        :color="modelValue.width === 5 ? 'primary' : 'default'"
        @click="updateSettings('width', 5)"
      >
        <v-icon size="12">mdi-circle</v-icon>
      </v-btn>
      <v-btn
        icon
        size="x-small"
        variant="text"
        :color="modelValue.width === 12 ? 'primary' : 'default'"
        @click="updateSettings('width', 12)"
      >
        <v-icon size="16">mdi-circle</v-icon>
      </v-btn>
    </div>

    <v-divider vertical class="mx-1"></v-divider>

    <!-- Undo / Redo / Clear / Save -->
    <v-sheet elevation="0" class="d-flex align-center bg-transparent gap-1">
      <v-btn icon size="x-small" variant="text" :disabled="!canUndo" @click="$emit('undo')">
        <v-tooltip activator="parent" location="top">Deshacer</v-tooltip>
        <v-icon size="18">mdi-undo</v-icon>
      </v-btn>

      <v-btn icon size="x-small" variant="text" :disabled="!canRedo" @click="$emit('redo')">
        <v-tooltip activator="parent" location="top">Rehacer</v-tooltip>
        <v-icon size="18">mdi-redo</v-icon>
      </v-btn>

      <v-divider vertical class="mx-1 my-1"></v-divider>

      <!-- Magic Eraser -->
      <v-btn icon size="x-small" variant="text" color="info" @click="$emit('clear-sketch')">
        <v-tooltip activator="parent" location="top">Varita Mágica (Borra Boceto Azul)</v-tooltip>
        <v-icon size="18">mdi-magic-staff</v-icon>
      </v-btn>

      <!-- Clear Canvas -->
      <v-btn icon size="x-small" variant="text" color="error" @click="$emit('clear')">
        <v-tooltip activator="parent" location="top">Borrar todo</v-tooltip>
        <v-icon size="18">mdi-delete-empty</v-icon>
      </v-btn>

      <v-divider vertical class="mx-1 my-1"></v-divider>

      <!-- Universal Save -->
      <v-btn icon size="x-small" variant="text" color="success" @click="$emit('save')">
        <v-tooltip activator="parent" location="top">Guardar Progreso</v-tooltip>
        <v-icon size="18">mdi-content-save</v-icon>
      </v-btn>
    </v-sheet>
  </v-card>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    // Expected format: { color: '#000', width: 5 }
  },
  canUndo: { type: Boolean, default: false },
  canRedo: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'undo', 'redo', 'clear', 'clear-sketch'])

const presetColors = [
  { value: '#000000', name: 'Negro' },
  { value: '#90CAF9', name: 'Boceto' },
  { value: '#FF5252', name: 'Rojo' },
  { value: '#FF4081', name: 'Rosa' },
  { value: '#E040FB', name: 'Morado' },
  { value: '#2196F3', name: 'Azul' },
  { value: '#4CAF50', name: 'Verde' },
  { value: '#FFEB3B', name: 'Amarillo' },
  { value: '#FF9800', name: 'Naranja' }
]

function updateSettings(key, val) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: val
  })
}
</script>

<style scoped>
.gap-1 { gap: 4px; }
.gap-2 { gap: 8px; }
.gap-4 { gap: 16px; }

.color-btn {
  border: 2px solid transparent;
  transition: transform 0.2s, border-color 0.2s;
}

.color-btn--active {
  transform: scale(1.15);
  border-color: rgba(0,0,0,0.2) !important;
}

/* Specific styling for the eraser (white) to make it visible */
.color-btn[class*="#FFFFFF"] {
  border-color: #e0e0e0;
}
</style>
