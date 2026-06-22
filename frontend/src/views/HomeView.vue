<template>
  <v-container fluid class="pa-6 pa-md-8">
    <!-- Welcome Section -->
    <section class="mb-6">
      <h2 class="text-h4 text-md-h3 font-weight-bold text-on-surface mb-1">
        ¡Hola, Pequeño Artista!
      </h2>
      <p class="text-body-1 text-on-surface-variant">
        ¿Qué quieres crear hoy?
      </p>
    </section>

    <!-- Bento Grid Dashboard -->
    <v-row>
      <!-- Tarjeta 1: Aprende a Dibujar (Pastel Azul) -->
      <v-col cols="12" md="7">
        <v-card
          class="bento-card pa-8"
          color="draw-blue"
          :min-height="280"
          hover
          @click="navigateTo('draw')"
        >
          <div class="d-flex flex-column justify-space-between fill-height">
            <div class="position-relative" style="z-index: 1;">
              <div class="icon-bubble mb-6">
                <v-icon size="40" color="primary">mdi-draw</v-icon>
              </div>
              <h3 class="text-h4 font-weight-bold text-primary mb-2">
                Aprende a Dibujar
              </h3>
              <p class="text-body-1" style="color: #1f477a; max-width: 240px;">
                Sigue los pasos y crea personajes increíbles.
              </p>
            </div>
          </div>

          <!-- Decorative element -->
          <div class="bento-decor bento-decor--right">
            <v-icon size="180" color="primary" style="opacity: 0.12;">
              mdi-draw
            </v-icon>
          </div>
        </v-card>
      </v-col>

      <!-- Tarjeta 2: Lienzo Libre (Pastel Verde) -->
      <v-col cols="12" md="5">
        <v-card
          class="bento-card pa-8"
          color="canvas-green"
          :min-height="280"
          hover
          @click="navigateTo('canvas')"
        >
          <div class="position-relative" style="z-index: 1;">
            <div class="icon-bubble mb-6">
              <v-icon size="40" color="secondary">mdi-palette</v-icon>
            </div>
            <h3 class="text-h4 font-weight-bold text-secondary mb-2">
              Lienzo Libre
            </h3>
            <p class="text-body-1" style="color: #145129;">
              ¡Usa todas las herramientas y crea tu propia obra maestra!
            </p>
          </div>

          <div class="bento-decor" style="right: -32px; bottom: -32px; opacity: 0.15;">
            <v-icon size="200" color="secondary">mdi-brush</v-icon>
          </div>
        </v-card>
      </v-col>

      <!-- Tarjeta 3: Mis Notas (Pastel Amarillo) -->
      <v-col cols="12" md="5">
        <v-card
          class="bento-card pa-8"
          color="notes-yellow"
          :min-height="280"
          hover
          @click="navigateTo('notes')"
        >
          <div class="d-flex flex-column fill-height position-relative" style="z-index: 1;">
            <div class="icon-bubble mb-6">
              <v-icon size="40" style="color: #856404;">mdi-note-text</v-icon>
            </div>
            <h3 class="text-h4 font-weight-bold mb-4" style="color: #856404;">
              Mis Notas
            </h3>

            <div class="d-flex flex-wrap ga-2">
              <v-chip color="#ffecb3" text-color="#856404" size="default" class="font-weight-bold">
                ⭐ Favoritos
              </v-chip>
              <v-chip color="#f8bbd0" text-color="#856404" size="default" class="font-weight-bold">
                🎨 Ideas
              </v-chip>
              <v-chip color="#b2ebf2" text-color="#856404" size="default" class="font-weight-bold">
                📝 Tareas
              </v-chip>
            </div>

            <p class="text-body-2 mt-auto" style="color: rgba(133, 100, 4, 0.8);">
              Organiza tus pensamientos con colores.
            </p>
          </div>
        </v-card>
      </v-col>

      <!-- Tarjeta 4: Colorear Dibujos (Pastel Rosa) -->
      <v-col cols="12" md="7">
        <v-card
          class="bento-card pa-8"
          color="color-pink"
          :min-height="280"
          hover
          @click="navigateTo('coloring')"
        >
          <div class="position-relative" style="z-index: 1;">
            <div class="icon-bubble mb-6">
              <v-icon size="40" color="tertiary">mdi-book-open-variant</v-icon>
            </div>
            <h3 class="text-h4 font-weight-bold text-tertiary mb-2">
              Colorear
            </h3>
            <p class="text-body-1" style="color: #653a46; max-width: 300px;">
              Cientos de dibujos esperando por tus colores favoritos.
            </p>
          </div>

          <!-- Animated pencils -->
          <div class="pencils-decoration">
            <div class="pencil pencil--1 bg-primary"></div>
            <div class="pencil pencil--2 bg-secondary"></div>
            <div class="pencil pencil--3 bg-tertiary"></div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- FAB: Nuevo Proyecto -->
    <v-btn
      icon
      size="72"
      color="primary"
      class="fab-nuevo"
      elevation="12"
    >
      <v-icon size="32">mdi-plus</v-icon>
      <v-tooltip activator="parent" location="start">Nuevo Proyecto</v-tooltip>
    </v-btn>
  </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateTo(module) {
  router.push({ name: module })
}
</script>

<style scoped>
/* ─── Bento Cards ───────────────────────────────────────── */
.bento-card {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.3s ease !important;
  border-radius: 16px !important;
}

.bento-card:hover {
  box-shadow: 0 16px 48px rgba(58, 95, 148, 0.16) !important;
}

.bento-card:active {
  transform: scale(0.96) !important;
}

/* ─── Icon Bubble ───────────────────────────────────────── */
.icon-bubble {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ─── Decorative Elements ───────────────────────────────── */
.bento-decor {
  position: absolute;
  pointer-events: none;
  transition: transform 0.5s ease;
}

.bento-decor--right {
  right: 0;
  bottom: 0;
  transform: translateY(16px);
}

.bento-card:hover .bento-decor--right {
  transform: translateY(0);
}

.bento-card:hover .bento-decor {
  transform: rotate(12deg);
}

/* ─── Animated Pencils ──────────────────────────────────── */
.pencils-decoration {
  position: absolute;
  right: 48px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 16px;
}

.pencil {
  width: 12px;
  height: 128px;
  border-radius: 9999px;
  animation: pencil-bounce 2s ease-in-out infinite;
}

.pencil--1 { animation-delay: 0.1s; transform: translateY(16px); }
.pencil--2 { animation-delay: 0.3s; transform: translateY(-16px); }
.pencil--3 { animation-delay: 0.5s; transform: translateY(32px); }

@keyframes pencil-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-16px); }
}

/* ─── FAB ───────────────────────────────────────────────── */
.fab-nuevo {
  position: fixed !important;
  bottom: 112px;
  right: 32px;
  z-index: 40;
  box-shadow: 0 12px 24px rgba(58, 95, 148, 0.24) !important;
}

.fab-nuevo:hover {
  transform: scale(1.1);
}

/* ─── Headlines ─────────────────────────────────────────── */
h2, h3 {
  font-family: 'Quicksand', sans-serif !important;
}
</style>
