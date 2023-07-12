import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import { showFullScreenLoading, tryHideFullScreenLoading } from '@/config/serviceLoading'
import { useUserStore } from '@/stores/modules/user'
import { LOGIN_URL } from '@/config/'
import { ResultEnum } from '@/enums/httpEnum'
import router from '@/routers'
import { checkStatus } from './helper/checkStatus'
import type { ResultData } from './interface'
import { PORT1 } from '@/api/config/servicePort'

/* axios 配置 */
const config = {
  // 默认地址请求地址，可在 .env.** 文件中修改
  baseURL: import.meta.env.VITE_API_URL, // url = base url + request url
  timeout: 20 * 5000, // 设置超时时间（10s）
  withCredentials: true //跨域携带cookie
}
class RequestHttp {
  service: AxiosInstance
  public constructor(config: AxiosRequestConfig) {
    // 实例化axios
    this.service = axios.create(config)

    /**
     * @description 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的token,存储到vuex/pinia/本地储存当中
     */
    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // * 如果当前请求需要显示 loading,在 api 服务中通过指定的第三个参数: { headers: { Loading: true } }来控制显示loading，参见loginApi
        config.headers?.Loading && showFullScreenLoading()
        const userStore = useUserStore()
        config.headers['x-access-token'] = userStore.token
        return { ...config }
      },
      (error: any) => {
        return Promise.reject(error)
      }
    )

    /**
     * @description 响应拦截器
     *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response
        const userStore = useUserStore()
        // * 在请求结束后，并关闭请求 loading
        tryHideFullScreenLoading()
        // * 登陆失效（code == 401）
        if (data.code === ResultEnum.OVERDUE) {
          ElMessage.error(data.msg)
          userStore.setToken('')
          router.replace(LOGIN_URL)
          return Promise.reject(data)
        }
        // * 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
        if (data.code && data.code !== ResultEnum.SUCCESS) {
          ElMessage.error(data.msg)
          // return Promise.reject(data)
        }
        // * 成功请求（在页面上除非特殊情况，否则不用在页面处理失败逻辑）
        return data
      },
      (error: AxiosError) => {
        const { response, message } = error
        tryHideFullScreenLoading()
        // 请求超时 && 网络错误单独判断，没有 response
        if (message.indexOf('timeout') !== -1) {
          ElMessage.error('请求超时！请您稍后重试')
        }
        if (message.indexOf('Network Error') !== -1) {
          ElMessage.error('网络错误！请您稍后重试')
        }
        // 根据响应的错误状态码，做不同的处理
        if (response) {
          checkStatus(response.status)
        }
        // 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
        if (!window.navigator.onLine) {
          router.replace('/500')
        }
      }
    )
  }
  // * 常用请求方法封装 // * PORT1 后端微服务端口名
  get<T>(url: string, params?: object, _object = {}, otherPort?: string): Promise<ResultData<T>> {
    const PORT = otherPort ? otherPort : PORT1
    return this.service.get(PORT + url, { params, ..._object })
  }
  post<T>(url: string, params?: object, _object = {}, otherPort?: string): Promise<ResultData<T>> {
    const PORT = otherPort ? otherPort : PORT1
    return this.service.post(PORT + url, params, _object)
  }
  put<T>(url: string, params?: object, _object = {}, otherPort?: string): Promise<ResultData<T>> {
    const PORT = otherPort ? otherPort : PORT1
    return this.service.put(PORT + url, params, _object)
  }
  delete<T>(url: string, params?: any, _object = {}, otherPort?: string): Promise<ResultData<T>> {
    const PORT = otherPort ? otherPort : PORT1
    return this.service.delete(PORT + url, { params, ..._object })
  }
  download(url: string, params?: object, _object = {}, otherPort?: string): Promise<BlobPart> {
    const PORT = otherPort ? otherPort : PORT1
    return this.service.post(PORT + url, params, { ..._object, responseType: 'blob' })
  }
}

export default new RequestHttp(config)
