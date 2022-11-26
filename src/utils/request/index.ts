import Taro from '@tarojs/taro'
import interceptors from './interceptors'

interceptors.forEach(interceptorItem => Taro.addInterceptor(interceptorItem))

// 请求的默认参数
const defaultOptions = {
  url: '',
  method: 'GET',
  data: {},
  loading: false,
}

const baseUrl = 'https://www.houho.site/api/'

export const mergeHeaders = options => {
  const cookie = Taro.getStorageSync('Cookies')
  const defaultHeaders = {
    'Content-Type': 'application/json',
  }
  if (cookie) {
    options.header = {
      ...defaultHeaders,
      ...(options.header || {}),
      Cookie: cookie,
    }
  } else {
    options.header = {
      ...defaultHeaders,
      ...(options.header || {}),
    }
  }
}

function request(options): Promise<any> {
  // merge 默认参数到 options
  mergeHeaders(options)
  // 设置header统一的属性
  options = {
    ...defaultOptions,
    ...options,
  }
  if (options.loading) Taro.showLoading()
  return new Promise((resolve: any, reject: any) => {
    Taro.request({
      url: baseUrl + options.url,
      data: options.data,
      header: {
        ...options.header,
      },
      method: options.method.toUpperCase(),
      responseType: options.responseType,
      success: function (res) {
        if (res.header['Set-Cookie']) {
          const cookies = res.header['Set-Cookie'].replace(/,/g, ';')
          Taro.setStorageSync('Cookies', cookies)
        }
        const { data, statusCode } = res
        if (statusCode >= 200 && statusCode < 300) {
          if (Object.prototype.toString.call(data) === '[object ArrayBuffer]') {
            resolve(data)
          } else {
            const { isSuccess, resultContent, errorCode } = data
            if (isSuccess === 'true' && !errorCode) {
              resolve(resultContent || true)
            } else {
              reject(data)
            }
          }
        } else {
          reject(res)
          console.log(`http---error`, res)
        }
      },
      fail: error => {
        reject(error)
      },
      complete: () => {
        if (options.loading) Taro.hideLoading()
      },
    })
  })
}

export default function createFetch<REQ extends Record<string, any>>(
  url: any,
  method: any
) {
  return (data?: REQ): Promise<any> => {
    return request({
      url,
      method,
      data: data,
    })
  }
}
