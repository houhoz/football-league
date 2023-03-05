import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { Button, Cell } from '@nutui/nutui-react-taro'
import { Image } from '@tarojs/components'
import { myGoal } from '@/servers/my'
import { wxLogin } from '@/servers/auth'
import header from '@/assets/header.png'
import './index.scss'

function Index() {
  const [data, setData] = useState<any>(null)
  const [userHeader, setUserHeader] = useState('')
  async function getMyData() {
    try {
      const res = await myGoal({ leagueId: 1 })
      setData(res)
      if (res?.id) {
        Taro.setStorageSync('bindSuccess', true)
      }
    } catch (error) {
      console.log('error :>> ', error)
    }
  }

  const handleBind = () => {
    const { showToast, reLaunch } = Taro
    Taro.login({
      success: async res => {
        if (res.code) {
          console.log(`res.code`, res.code)
          try {
            await wxLogin({
              userCode: res.code,
            })
            showToast({
              title: '绑定成功',
            })
            Taro.setStorageSync('bindSuccess', true)
            // Taro.removeStorageSync('name')
            // Taro.removeStorageSync('Cookies')
            // reLaunch({ url: '/pages/login/index' })
          } catch (error) {
            console.log('error :>> ', error)
          }
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      },
    })
  }

  useEffect(() => {
    getMyData()
  }, [])
  return (
    <>
      <div className='header-wrap'>
        <div className='user-info'>
          <Image className='header' src={userHeader || header} />
          {data?.name ? (
            <div className='name'>{data?.name}</div>
          ) : (
            <div
              className='name'
              onClick={() => {
                const bindSuccess = Taro.getStorageSync('bindSuccess')
                if (bindSuccess) {
                  Taro.navigateTo({ url: '/pages/login/index' })
                } else {
                  Taro.navigateTo({ url: '/pages/login1/index' })
                }
              }}
            >
              未登录
            </div>
          )}
        </div>
        <Button
          openType='chooseAvatar'
          className='btn'
          size='small'
          type='primary'
          onChooseAvatar={res => {
            setUserHeader(res.detail.avatarUrl)
          }}
        >
          修改头像
        </Button>
      </div>
      <div className='operate'>
        {data && !data?.id && (
          <Cell title='绑定微信登录' isLink onClick={handleBind} />
        )}
        {data && (
          <Cell
            title='退出登录'
            isLink
            onClick={() => {
              Taro.removeStorageSync('name')
              Taro.removeStorageSync('Cookies')
              const page = Taro.getCurrentPages().pop() //获取当前页面实例
              if (page == undefined || page == null) return
              //调用实例的onLoad方法重新加载数据;
              page.onLoad(page.options)
            }}
          />
        )}
      </div>
    </>
  )
}
export default Index
