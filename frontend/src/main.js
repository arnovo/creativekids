import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { vuetify } from '@/plugins/vuetify'
import router from '@/router'
import App from '@/App.vue'

// Material Design Icons
import '@mdi/font/css/materialdesignicons.css'

const app = createApp(App)

app.use(createPinia())
app.use(vuetify)
app.use(router)

app.mount('#app')
