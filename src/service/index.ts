import convertKeysToCamelCase from "@/utils/convertKeysToCamelCase"
import { Message, Modal, Notification } from "@arco-design/web-react"
import axios from "axios"

const http = axios.create({
  timeout: 5000
})

const token = localStorage.getItem("token")
  ? JSON.parse(localStorage.getItem("token")).token
  : undefined

http.interceptors.request.use(
  function (config) {
    if (config.method === "get") {
      config.params = {
        ...convertKeysToCamelCase(config.params),
        token: token
      }
    } else {
      if (config.data) {
        if (config.data instanceof FormData) {
          return config
        } else {
          config.data = {
            ...convertKeysToCamelCase(config.data),
            token
          }
        }
      } else {
        config.data = {
          token
        }
      }
    }
    return config
  },
  function (error) {
    console.log("🚀 ~ error:", error)
  }
)

const codeMessage: { [key: string]: string } = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  405: "请求方法不被允许。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。"
}

http.interceptors.response.use(
  function (response) {
    if (response) {
      if (response.status) {
        if (response.status === 200) {
          if (
            response.data.code === 0 ||
            response.config?.params?.isCode === false
          ) {
            return response.data
          }
          if (response.data.code === 6) {
            window.location.href = "/login"
            Modal.info({
              title: "登录过期",
              content: "请重新登录。",
              hideCancel: true,
              okButtonProps: {
                status: "danger"
              }
            })
            throw new Error(response.data.message)
          } else {
            /**抛出异常 */
            console.error(response.data.message)
            Message.error(response.data.message)
            throw new Error(response.data.message)
          }
        } else {
          const errorText = codeMessage[response.status] || response.statusText
          const { status } = response
          Notification.error({
            title: `请求错误 ${status}`,
            content: errorText
          })
        }
      }
    } else {
      Notification.error({
        title: "请求超时，请检查网络并重新尝试",
        content: "请求超时"
      })
    }
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default http
