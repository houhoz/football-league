import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { getAllLeague } from '@/servers/league'
import logo from '@/assets/logo.png'
import './index.scss'

function Index() {
  const [leagues, setLeagues] = useState<any[]>([])
  async function getLeagues() {
    try {
      const res = await getAllLeague()
      setLeagues(res)
    } catch (error) {
      console.log('error :>> ', error)
    }
  }

  useEffect(() => {
    getLeagues()
  }, [])

  return (
    <div className='leagues'>
      {leagues.map(item => (
        <div
          onClick={() =>
            Taro.navigateTo({
              url: `/pages/league/index?leagueId=${item.id}`,
            })
          }
          className='leagues-item'
          key={item.id}
        >
          <img className='leagues-item-logo' src={logo} />
          <div className='leagues-item-name'>{item.name}</div>
        </div>
      ))}
    </div>
  )
}
export default Index
