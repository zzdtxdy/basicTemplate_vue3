import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'], // 需要导入的内容
      dts: 'src/auto-import.d.ts',
      resolvers: [ElementPlusResolver()] //自动导入element-plus
    }),
    Components({
      resolvers: [ElementPlusResolver()] //自动导入element-plus
    })
  ],
  // 跨域
  server: {
    cors: true, // 默认启用并允许任何源
    proxy: {
      '/api': {
        target: 'https://mock.mengxuegu.com/mock/629d727e6163854a32e8307e',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
