import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { Cell } from '@nutui/nutui-react-taro'
import { myGoal } from '@/servers/my'
import header from '@/assets/header.png'
import './index.scss'

function Index() {
  const [data, setData] = useState<any>(null)
  async function getMyData() {
    try {
      const res = await myGoal()
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
          <img className='header' src={header} />
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
        <div className='user-data'>
          <div className='data-item'>
            <div className='data-num'>{data?.goalNum || 0}</div>
            <div className='data-name'>进球</div>
          </div>
          <div className='data-item'>
            <div className='data-num'>{data?.assistNum || 0}</div>
            <div className='data-name'>助攻</div>
          </div>
          <div className='data-item'>
            <div className='data-num'>{data?.yellowNum || 0}</div>
            <div className='data-name'>黄牌</div>
          </div>
          <div className='data-item'>
            <div className='data-num'>{data?.redNum || 0}</div>
            <div className='data-name'>红牌</div>
          </div>
        </div>
      </div>
      <div className='operate'>
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
