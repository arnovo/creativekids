<template>
  <v-container fluid class="fill-height register-bg pa-4 pa-md-12 d-flex align-center justify-center">
    <v-card class="register-card rounded-xl pa-6 pa-sm-10 elevation-8 border-0" width="460">
      
      <!-- Título de Registro -->
      <div class="text-center mb-8">
        <div class="d-inline-flex pa-3 rounded-circle bg-secondary-lighten-4 mb-3">
          <v-icon size="48" color="secondary" class="animate-bounce">mdi-star</v-icon>
        </div>
        <h1 class="text-h4 font-weight-black text-secondary font-kids">¡Crea tu Perfil!</h1>
        <p class="text-subtitle-2 text-grey-darken-1 mt-1 font-weight-medium">
          Regístrate para guardar todos tus hermosos dibujos
        </p>
      </div>

      <!-- Formulario de Registro -->
      <v-form ref="form" v-model="isValid" @submit.prevent="handleRegister">
        
        <v-text-field
          v-model="formFields.name"
          label="Tu nombre o apodo"
          placeholder="Escribe tu nombre aquí..."
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
          density="comfortable"
          class="mb-3 font-weight-medium rounded-lg"
          color="secondary"
          :rules="[v => !!v || 'Escribe tu nombre']"
          hide-details="auto"
        ></v-text-field>

        <v-text-field
          v-model="formFields.email"
          label="Tu correo electrónico (o el de tus padres)"
          placeholder="nombre@ejemplo.com"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          density="comfortable"
          class="mb-3 font-weight-medium rounded-lg"
          color="secondary"
          :rules="[v => !!v || 'Escribe tu correo', v => /.+@.+\..+/.test(v) || 'El correo no es correcto']"
          hide-details="auto"
        ></v-text-field>

        <v-text-field
          v-model="formFields.password"
          label="Crea una contraseña secreta"
          placeholder="Mínimo 6 letras..."
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showPassword ? 'text' : 'password'"
          variant="outlined"
          density="comfortable"
          class="mb-6 font-weight-medium rounded-lg"
          color="secondary"
          @click:append-inner="showPassword = !showPassword"
          :rules="[v => !!v || 'Escribe tu contraseña', v => v.length >= 6 || 'La contraseña debe tener mínimo 6 letras']"
          hide-details="auto"
        ></v-text-field>

        <v-alert v-if="errorMsg" type="error" variant="tonal" class="mb-4 text-body-2 rounded-lg" closable>
          {{ errorMsg }}
        </v-alert>

        <v-btn
          color="secondary"
          block
          size="large"
          type="submit"
          :loading="isLoading"
          class="font-weight-bold rounded-pill shadow-btn text-subtitle-1 py-3 text-white"
          elevation="3"
        >
          ¡Comenzar a Dibujar! ✨
        </v-btn>
      </v-form>

      <!-- Volver al login -->
      <div class="text-center mt-6 text-body-2 text-grey-darken-1 font-weight-medium">
        ¿Ya tienes un perfil creado?
        <router-link to="/login" class="text-secondary text-decoration-none font-weight-bold ml-1 hover-link">
          ¡Inicia sesión aquí! 🎨
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

const formFields = reactive({
  name: '',
  email: '',
  password: ''
})

async function handleRegister() {
  if (!isValid.value) return
  isLoading.value = true
  errorMsg.value = ''
  
  try {
    const success = await authStore.register(formFields)
    if (success) {
      router.push('/')
    }
  } catch (error) {
    errorMsg.value = error.response?.data?.message || 'Error al crear el perfil. El correo podría estar en uso.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;800&display=swap');

.register-bg {
  background: linear-gradient(135deg, #b2ebf2 0%, #80deea 50%, #c8e6c9 100%);
  min-height: 100vh;
  font-family: 'Nunito', sans-serif;
}

.register-card {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.font-kids {
  font-family: 'Fredoka One', cursive !important;
  letter-spacing: 1px;
}

.bg-secondary-lighten-4 {
  background-color: #e0f2f1;
}

.shadow-btn {
  transition: transform 0.2s, box-shadow 0.2s;
}

.shadow-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 150, 136, 0.4) !important;
}

.hover-link:hover {
  text-decoration: underline !important;
}

/* Micro animación para la estrellita */
@keyframes bounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-6px) rotate(15deg); }
}

.animate-bounce {
  animation: bounce 3s infinite ease-in-out;
}
</style>
