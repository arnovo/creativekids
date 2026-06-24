import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'CreativaKids — Iniciar Sesión', guest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterView.vue'),
    meta: { title: 'CreativaKids — Crear Perfil', guest: true }
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'CreativaKids — ¡Hola, Pequeño Artista!', navTab: null },
  },
  {
    path: '/dibujar',
    name: 'draw',
    component: () => import('@/views/LearnToDrawView.vue'),
    meta: { title: 'CreativaKids — Aprende a Dibujar', navTab: 'draw' },
  },
  {
    path: '/lienzo',
    name: 'free-drawings',
    component: () => import('@/views/FreeDrawingsView.vue'),
    meta: { title: 'CreativaKids — Lienzo Libre', navTab: 'canvas' },
  },
  {
    path: '/lienzo/:id',
    name: 'free-canvas',
    component: () => import('@/views/FreeCanvasView.vue'),
    meta: { title: 'CreativaKids — Lienzo Libre', navTab: 'canvas' },
  },
  {
    path: '/notas',
    name: 'notes',
    component: () => import('@/views/NotesView.vue'),
    meta: { title: 'CreativaKids — Mis Notas', navTab: 'notes' },
  },
  {
    path: '/colorear',
    name: 'coloring',
    component: () => import('@/views/ColoringView.vue'),
    meta: { title: 'CreativaKids — Colorear', navTab: 'coloring' },
  },
  {
    path: '/mates',
    name: 'math',
    component: () => import('@/views/MathView.vue'),
    meta: { title: 'CreativaKids — Matemáticas', navTab: 'math' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Authentication navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Try to load user profile on startup if we have a saved token
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser()
  }

  const isAuthenticated = authStore.isAuthenticated

  if (to.meta.guest) {
    if (isAuthenticated) {
      next('/')
    } else {
      next()
    }
  } else {
    // Allow free access to all views for guests
    next()
  }
})

// Dynamic page title
router.afterEach((to) => {
  document.title = to.meta?.title || 'CreativaKids'
})

export default router
