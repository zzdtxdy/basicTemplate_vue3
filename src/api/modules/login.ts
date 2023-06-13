import type { Login } from '@/api/interface/index'
import DynamicRouter from '@/assets/json/dynamicRouter.json'
import AuthButtons from '@/assets/json/authButtons.json'
// import qs from 'qs'
import http from '@/api'

/**
 * @name 登录模块
 */
// * 用户登录
export const loginApi = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>(`/login`, params) // 正常 post json 请求  ==>  application/json
  return http.post<Login.ResLogin>(`/login`, params, { headers: { Loading: true } }) // 控制当前请求显示 loading
  return http.post<Login.ResLogin>(`/login`, {}, { params }) // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>( `/login`, qs.stringify(params)) // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>( `/login?${qs.stringify(params, { arrayFormat: 'repeat' })}`) // 如果是 get 请求可以携带数组等复杂参数
}

// * 获取按钮权限
export const getAuthButtonListApi = () => {
  return http.get<Login.ResAuthButtons>(`/auth/buttons`, {})
  // 如果想让按钮权限变为本地数据，注释上一行代码，并引入本地 authButtons.json 数据
  return AuthButtons
}

// * 获取菜单列表
export const getAuthMenuListApi = () => {
  return http.get<Menu.MenuOptions[]>(`/menu/list`, {})
  // 如果想让菜单变为本地数据，注释上一行代码，并引入本地 dynamicRouter.json 数据
  return DynamicRouter
}

// * 用户退出登录
export const logoutApi = () => {
  return http.post(`/logout`)
}
