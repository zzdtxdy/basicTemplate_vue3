/**
 * v-auth
 * 按钮权限指令
 */
import { useAuthStore } from '@/stores/modules/auth'
import type { Directive, DirectiveBinding } from 'vue'

const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // value 获取用户使用自定义指令绑定的内容
    const { value } = binding
    const authStore = useAuthStore()
    // 获取当前路由下用户的权限按钮
    const currentPageRoles = authStore.authButtonListGet[authStore.routeName] ?? []
    // 判断是数组 v-auth="['add', 'edit']" 还是字符串 v-auth="'add'"
    if (value instanceof Array && value.length) {
      const hasPermission = value.every((item) => currentPageRoles.includes(item))
      if (!hasPermission) el.remove()
    }
    // 还是一个字符串
    else {
      if (!currentPageRoles.includes(value)) el.remove()
    }
  }
}

export default permission
