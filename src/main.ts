import { createApp } from 'vue'
import App from './App.vue'

// vue Router
import router from '@/routers/index'
// errorHandler
import errorHandler from '@/utils/errorHandler'
// pinia store
import pinia from '@/stores/index'
// custom directives
import directives from '@/directives/index'
// element plus
import ElementPlus from 'element-plus'
const app = createApp(App)

app.config.errorHandler = errorHandler

app.use(pinia).use(router).use(directives).use(ElementPlus).mount('#app')
