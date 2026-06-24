<template>
  <v-app>
    <!-- Top App Bar -->
    <v-app-bar
      v-if="!isAuthPage"
      :height="88"
      color="surface"
      flat
      class="app-bar-shadow"
    >
      <v-btn
        icon
        variant="text"
        color="primary"
        size="x-large"
        @click="goBack"
      >
        <v-icon size="32">mdi-arrow-left</v-icon>
      </v-btn>

      <v-app-bar-title
        class="app-title text-primary"
        style="cursor: pointer;"
        @click="router.push('/')"
      >
        CreativaKids
      </v-app-bar-title>

      <v-btn
        icon
        variant="text"
        color="primary"
        size="x-large"
        @click="router.push('/')"
      >
        <v-icon size="32">mdi-home</v-icon>
      </v-btn>

      <!-- Saludo personalizado del niño y botón de Salir, o botón de entrar si es invitado -->
      <template v-if="authStore.isAuthenticated && authStore.user">
        <span class="mr-2 text-primary font-weight-bold text-subtitle-1 d-none d-sm-inline">
          ¡Hola, {{ authStore.user.name }}! 👋
        </span>
        <v-btn
          icon
          variant="text"
          color="error"
          size="x-large"
          class="ml-1"
          @click="handleLogout"
          title="Cerrar sesión"
        >
          <v-icon size="32">mdi-logout</v-icon>
        </v-btn>
      </template>
      <template v-else>
        <v-btn
          color="primary"
          variant="flat"
          class="rounded-pill font-weight-bold px-5 mr-2 elevation-2"
          @click="router.push('/login')"
        >
          ¡Entrar! 🚀
        </v-btn>
      </template>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

    <!-- Bottom Navigation -->
    <v-bottom-navigation
      v-if="!isAuthPage"
      :model-value="activeTab"
      :height="96"
      color="primary"
      bg-color="surface-container-lowest"
      class="bottom-nav-shadow"
      grow
    >
      <v-btn value="draw" @click="router.push('/dibujar')">
        <v-icon>mdi-draw</v-icon>
        <span class="nav-label">Dibujar</span>
      </v-btn>

      <v-btn value="canvas" @click="router.push('/lienzo')">
        <v-icon>mdi-palette</v-icon>
        <span class="nav-label">Lienzo</span>
      </v-btn>

      <v-btn value="notes" @click="router.push('/notas')">
        <v-icon>mdi-note-text</v-icon>
        <span class="nav-label">Notas</span>
      </v-btn>

      <v-btn value="coloring" @click="router.push('/colorear')">
        <v-icon>mdi-book-open-variant</v-icon>
        <span class="nav-label">Colorear</span>
      </v-btn>

      <v-btn value="math" @click="router.push('/mates')">
        <v-icon>mdi-calculator</v-icon>
        <span class="nav-label">Mates</span>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const activeTab = computed(() => route.meta?.navTab || null)
const isAuthPage = computed(() => route.name === 'login' || route.name === 'register')

function goBack() {
  router.push('/')
}

async function handleLogout() {
  if (confirm('¿Seguro que quieres salir de tu cuenta?')) {
    await authStore.logout()
    router.push('/login')
  }
}
</script>

<style>
/* ─── Global Base Styles ────────────────────────────────── */
html {
  overflow-y: auto !important;
  -webkit-tap-highlight-color: transparent;
}

body {
  font-family: 'Nunito Sans', sans-serif;
  overscroll-behavior-y: contain;
}

/* ─── Typography ────────────────────────────────────────── */
.app-title {
  font-family: 'Quicksand', sans-serif !important;
  font-weight: 700 !important;
  font-size: 32px !important;
  letter-spacing: -0.02em !important;
}

.nav-label {
  font-family: 'Nunito Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.02em;
  margin-top: 4px;
}

/* ─── Shadows matching stitch.html ──────────────────────── */
.app-bar-shadow {
  box-shadow: 0 4px 12px rgba(58, 95, 148, 0.12) !important;
}

.bottom-nav-shadow {
  box-shadow: 0 -8px 24px rgba(58, 95, 148, 0.08) !important;
  border-radius: 16px 16px 0 0 !important;
}

/* ─── Avatar border ─────────────────────────────────────── */
.avatar-border {
  border: 2px solid rgb(var(--v-theme-primary-container));
}

/* ─── Route transition ──────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ─── Headline font family override ─────────────────────── */
.text-h1, .text-h2, .text-h3, .text-h4, .text-h5, .text-h6 {
  font-family: 'Quicksand', sans-serif !important;
}
</style>
