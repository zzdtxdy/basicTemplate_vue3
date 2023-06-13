import type { App } from 'vue'
import auth from './modules/auth'
import copy from './modules/copy'
import waterMarker from './modules/waterMarker'
import draggable from './modules/draggable'
import longpress from './modules/longpress'

const directivesList: any = {
  // Custom directives
  auth,
  copy,
  waterMarker,
  draggable,
  longpress
}

const directives = {
  install: function (app: App<Element>) {
    Object.keys(directivesList).forEach((key) => {
      // 注册所有自定义指令
      app.directive(key, directivesList[key])
    })
  }
}

export default directives
