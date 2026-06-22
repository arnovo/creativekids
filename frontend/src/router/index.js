import { createRouter, createWebHistory } from 'vue-router'

const routes = [
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
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Dynamic page title
router.afterEach((to) => {
  document.title = to.meta?.title || 'CreativaKids'
})

export default router
