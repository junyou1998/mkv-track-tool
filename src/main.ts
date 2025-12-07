import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import i18n from './i18n'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(i18n)
app.mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})
