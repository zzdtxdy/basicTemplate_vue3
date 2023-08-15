import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 自动导入vue element-plus
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// 打包文件大小预览模块
import { visualizer } from 'rollup-plugin-visualizer'
// 配置gzip压缩
import viteCompression from 'vite-plugin-compression'

const fs = require('fs')
const resolve = (dir: string) => path.join(__dirname, dir) //__dirname 总是指向被执行 js 文件的绝对路径 EX:/d1/d2/myscript.js 文件中写了 __dirname， 它的值就是 /d1/d2

// https://vitejs.dev/config/
export default defineConfig({
  // 配置在打包时，保障所有css\js能被找到
  //“base"被设置为”/your-base-path/“。这意味着应用程序中的所有静态资源URL和路由都将在前面添加”/your-base-path/"。例如，如果有一个路径为/assets/image.png的图像，它将被解析为/your-base-path/assets/image.png。
  // base: '/',

  // 需要用到的插件数组
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router'], // 需要导入的内容
      dts: 'src/auto-import.d.ts',
      resolvers: [ElementPlusResolver()] //自动导入element-plus
    }),
    Components({
      resolvers: [ElementPlusResolver()] //自动导入element-plus
    }),
    //打包文件大小预览
    visualizer({
      open: false, //注意这里要设置为true，否则无效
      filename: 'stats.html', //分析图生成的文件名
      gzipSize: true, // 收集 gzip 大小并将其显示
      brotliSize: true // 收集 brotli 大小并将其显示
    }),
    // gizp
    viteCompression({
      verbose: true, // 默认即可
      disable: false, //开启压缩(不禁用)，默认即可
      deleteOriginFile: false, ///是否删除原文件，最好不删除，服务器会自动优先返回同名的.gzip资源，如果找不到还可以拿原始文件
      threshold: 10240, //压缩前最小文件大小
      algorithm: 'gzip', //压缩算法
      ext: '.gz' //文件类型
    }),
    // brotli 压缩
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'brotliCompress',
      ext: '.br'
    })
  ],
  // 跨域
  server: {
    cors: true, // 默认启用并允许任何源
    https: {
      // 主要是下面两行的配置文件，不要忘记引入 fs 和 path 两个对象
      cert: fs.readFileSync(path.join(__dirname, 'src/ssl/cert.crt')),
      key: fs.readFileSync(path.join(__dirname, 'src/ssl/cert.key'))
    },
    proxy: {
      '/api': {
        target: 'https://www.fastmock.site/mock/f81e8333c1a9276214bcdbc170d9e0a0',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  //配置别名
  resolve: {
    alias: {
      '@': resolve('./src'),
      comps: resolve('src/components'), // comps表示当前的src目录路径下components
      apis: resolve('src/apis'), // apis表示当前的src目录路径下apis
      views: resolve('src/views'),
      utils: resolve('src/utils'),
      routes: resolve('src/routes'),
      'yaml-parser': 'yaml-loader/dist/cjs.js'
    }
  },
  optimizeDeps: {
    include: ['yaml-loader']
  }
})
