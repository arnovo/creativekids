import axios from 'axios'

/**
 * Axios instance pre-configured for the Laravel API.
 * Requests go to /api/* which Nginx proxies to PHP-FPM.
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
})

// ─── Request interceptor for authentication tokens ────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('creativakids_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response interceptor for error handling ──────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('creativakids_token')
      // Forzar recarga si expira el token para limpiar la tienda
      if (!window.location.pathname.endsWith('/login')) {
        window.location.href = '/login'
      }
    }
    const message = error.response?.data?.message || error.message
    console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}: ${message}`)
    return Promise.reject(error)
  }
)

export default api
