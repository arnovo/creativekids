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

// ─── Response interceptor for error handling ──────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message
    console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}: ${message}`)
    return Promise.reject(error)
  }
)

export default api
