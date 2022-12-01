import { useEffect, useState, useRef } from 'react'
import Taro from '@tarojs/taro'
import { myGoal } from '@/servers/my'
import './index.scss'

function Index() {
  const pageIns = useRef<any>()
  const [data, setData] = useState<any>(null)
  async function getMyData(leagueId, name) {
    try {
      const res = await myGoal({ leagueId, name })
      setData(res)
    } catch (error) {
      console.log('error :>> ', error)
    }
  }

  useEffect(() => {
    pageIns.current = Taro.getCurrentInstance()
    const { leagueId, playerName = '' } = pageIns.current.router.params
    getMyData(leagueId, playerName)
  }, [])
  return (
    <>
      <div className='header-wrap'>
        <div className='user-info'>
          {data?.name && <div className='name'>{data?.name}</div>}
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
    </>
  )
}
export default Index
