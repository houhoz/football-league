import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { Cell, Button } from '@nutui/nutui-react-taro'
import { Image } from '@tarojs/components'
import { myGoal } from '@/servers/my'
import header from '@/assets/header.png'
import './index.scss'

function Index() {
  const [data, setData] = useState<any>(null)
  const [userHeader, setUserHeader] = useState('')
  async function getMyData() {
    try {
      const res = await myGoal({ leagueId: 1 })
      setData(res)
    } catch (error) {
      console.log('error :>> ', error)
    }
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
              onClick={() => Taro.navigateTo({ url: '/pages/login/index' })}
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
        <Cell title='修改密码' isLink />
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
