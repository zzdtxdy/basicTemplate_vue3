<template>
  <!-- 配置全局默认主题、语言 组件大小 -->
  <el-config-provider :locale="locale" :size="assemblySize" :button="buttonConfig">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import { onMounted, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getBrowserLang } from '@/utils'
// import { useTheme } from '@/hooks/useTheme'
import { ElConfigProvider } from 'element-plus'
import { LanguageType } from './stores/interface'
import { useGlobalStore } from '@/stores/modules/global'

import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const globalStore = useGlobalStore()

// init theme
// const { initTheme } = useTheme()
// initTheme()

// init language
const i18n = useI18n()
onMounted(() => {
  const language = globalStore.language ?? getBrowserLang()
  i18n.locale.value = language //设置默认语言
  globalStore.setGlobalState('language', language as LanguageType)
})

// element language
const locale = computed(() => {
  if (globalStore.language == 'zh') return zhCn
  if (globalStore.language == 'en') return en
  return getBrowserLang() == 'zh' ? zhCn : en
})

// element assemblySize 全局组件大小
const assemblySize = computed(() => globalStore.assemblySize)

// element button config 自动在两个中文字符之间插入空格
const buttonConfig = reactive({ autoInsertSpace: false })
</script>
