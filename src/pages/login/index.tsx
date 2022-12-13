import { Button } from '@nutui/nutui-react-taro'
import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import logo from '@/assets/logo.png'
import { wxLogin } from '@/servers/auth'

import './index.scss'

function Index() {
  const { showToast, setStorageSync, reLaunch } = Taro
  const submit = async () => {
    Taro.login({
      success: async res => {
        if (res.code) {
          console.log(`res.code`, res.code)
          try {
            const response = await wxLogin({
              userCode: res.code,
            })
            showToast({
              title: '登录成功',
            })
            setStorageSync('name', response.name)
            reLaunch({ url: '/pages/leagues/index' })
          } catch (error) {
            console.log('error :>> ', error)
          }
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
    })
  }
  return (
    <View className='login-wrap'>
      <Image className='logo' mode='widthFix' src={logo} />
      <Button className='submit-btn' type='info' size='large' onClick={submit}>
        微信登录
      </Button>
    </View>
  )
}
export default Index
