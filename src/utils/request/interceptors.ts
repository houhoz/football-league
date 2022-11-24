import Taro from '@tarojs/taro'
import { HTTP_STATUS } from './config'

const customInterceptor = chain => {
  const requestParams = chain.requestParams

  return chain.proceed(requestParams).then(res => {
    // 只要请求成功，不管返回什么状态码，都走这个回调
    if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
      return Promise.reject('请求资源不存在')
    } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
      return Promise.reject('服务端出现了问题')
    } else if (
      res.statusCode === HTTP_STATUS.AUTHENTICATE &&
      res.data.message === 'Unauthorized'
    ) {
      // token 失效
      // return getToken()
    } else if (
      res.statusCode === HTTP_STATUS.FORBIDDEN &&
      res.data.code === 'E_INSUFFICIENT_PERMISSIONS'
    ) {
      // post请求只有会员才能操作
      return Taro.showModal({
        title: '',
        content: '登录后才可继续操作\r\n是否微信授权登录',
        success: function (response) {
          if (response.confirm) {
            // pageToLogin()
          } else if (response.cancel) {
            console.log('用户点击取消')
          }
        },
      })
    } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
      return res.data
    }
  })
}

// Taro 提供了两个内置拦截器
// logInterceptor - 用于打印请求的相关信息
// timeoutInterceptor - 在请求超时时抛出错误。
// const interceptors = [customInterceptor, Taro.interceptors.logInterceptor];
const interceptors = [customInterceptor, Taro.interceptors.timeoutInterceptor]

export default interceptors
