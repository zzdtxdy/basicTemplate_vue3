import { createI18n } from 'vue-i18n'
import { getBrowserLang } from '@/utils'
import zh from './modules/zh.json'
import en from './modules/en.json'
const messages = {
  zh: zh,
  en: en
}

const i18n = createI18n({
  // Use Composition API, Set to false
  allowComposition: true, // 为Composition API模式
  legacy: false, //插件报错Uncaught SyntaxError: Not available in legacy mode解决方法
  locale: getBrowserLang(),
  messages
})

export default i18n
