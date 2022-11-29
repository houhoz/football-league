import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { Button } from '@nutui/nutui-react-taro'
import './index.scss'

function Index() {
  const [code, setCode] = useState('')
  const login = () => {
    Taro.login({
      success: async res => {
        if (res.code) {
          console.log(`res.code`, res.code)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
    })
  }

  useEffect(() => {
    login()
  }, [])

  const onGetUserInfo = e => {
    console.log('e.detail :>> ', e.detail)
  }

  return (
    <>
      <Button openType='getUserInfo' onGetUserInfo={onGetUserInfo}>
        获取
      </Button>
    </>
  )
}
export default Index
