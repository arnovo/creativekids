<template>
  <v-container fluid class="fill-height login-bg pa-4 pa-md-12 d-flex align-center justify-center">
    <v-card class="login-card rounded-xl pa-6 pa-sm-10 elevation-8 border-0" width="460">
      
      <!-- Logo o Título Infantil -->
      <div class="text-center mb-8">
        <div class="d-inline-flex pa-3 rounded-circle bg-primary-lighten-4 mb-3">
          <v-icon size="48" color="primary" class="animate-bounce">mdi-palette-swatch</v-icon>
        </div>
        <h1 class="text-h4 font-weight-black text-primary font-kids">CreativaKids</h1>
        <p class="text-subtitle-2 text-grey-darken-1 mt-1 font-weight-medium">
          ¡Inicia sesión para entrar en tu cuaderno de arte!
        </p>
      </div>

      <!-- Formulario -->
      <v-form ref="form" v-model="isValid" @submit.prevent="handleLogin">
        <v-text-field
          v-model="credentials.email"
          label="Tu correo electrónico"
          placeholder="nombre@ejemplo.com"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          density="comfortable"
          class="mb-3 font-weight-medium rounded-lg"
          color="primary"
          :rules="[v => !!v || 'Escribe tu correo', v => /.+@.+\..+/.test(v) || 'El correo no es correcto']"
          hide-details="auto"
        ></v-text-field>

        <v-text-field
          v-model="credentials.password"
          label="Tu contraseña secreta"
          placeholder="Escribe aquí..."
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          density="comfortable"
          class="mb-6 font-weight-medium rounded-lg"
          color="primary"
          @click:append-inner="showPassword = !showPassword"
          :rules="[v => !!v || 'Escribe tu contraseña', v => v.length >= 6 || 'La contraseña debe tener mínimo 6 letras']"
          hide-details="auto"
        ></v-text-field>

        <v-alert v-if="errorMsg" type="error" variant="tonal" class="mb-4 text-body-2 rounded-lg" closable>
          {{ errorMsg }}
        </v-alert>

        <v-btn
          color="primary"
          block
          size="large"
          type="submit"
          :loading="isLoading"
          class="font-weight-bold rounded-pill shadow-btn text-subtitle-1 py-3"
          elevation="3"
        >
          ¡Entrar a Pintar! 🎨
        </v-btn>
      </v-form>

      <!-- Ir a registro -->
      <div class="text-center mt-6 text-body-2 text-grey-darken-1 font-weight-medium">
        ¿No tienes una cuenta aún?
        <router-link to="/register" class="text-primary text-decoration-none font-weight-bold ml-1 hover-link">
          ¡Crea tu perfil aquí! ✨
        </router-link>
      </div>

    </v-card>
  </v-container>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isValid = ref(false)
const isLoading = ref(false)
const showPassword = ref(false)
const errorMsg = ref('')

const credentials = reactive({
  email: '',
  password: ''
})

async function handleLogin() {
  if (!isValid.value) return
  isLoading.value = true
  errorMsg.value = ''
  
  try {
    const success = await authStore.login(credentials)
    if (success) {
      router.push('/')
    }
  } catch (error) {
    errorMsg.value = error.response?.data?.message || 'Error al iniciar sesión. Comprueba tus datos.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;800&display=swap');

.login-bg {
  background: linear-gradient(135deg, #ffecb3 0%, #ffcc80 50%, #f8bbd0 100%);
  min-height: 100vh;
  font-family: 'Nunito', sans-serif;
}

.login-card {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.font-kids {
  font-family: 'Fredoka One', cursive !important;
  letter-spacing: 1px;
}

.bg-primary-lighten-4 {
  background-color: #e3f2fd;
}

.shadow-btn {
  transition: transform 0.2s, box-shadow 0.2s;
}

.shadow-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(33, 150, 243, 0.4) !important;
}

.hover-link:hover {
  text-decoration: underline !important;
}

/* Micro animación para el icono de paleta */
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.animate-bounce {
  animation: bounce 3s infinite ease-in-out;
}
</style>
