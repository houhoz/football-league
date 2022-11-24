import { useEffect, useState, useRef } from 'react'
import Taro from '@tarojs/taro'
import { Collapse, CollapseItem, Cell } from '@nutui/nutui-react-taro'
import { getAllLeague } from '@/servers/league'
import './index.scss'

function Index() {
  const [league, setLeague] = useState<any>(null)
  const pageIns = useRef<any>()
  function getLeagues() {
    getAllLeague().then(res => {
      const { leagueId = 0 } = pageIns.current.router.params
      const cur = res.find(item => item.id === Number(leagueId))
      if (cur) {
        Taro.setNavigationBarTitle({
          title: cur?.name,
        })
        setLeague(cur)
      }
    })
  }

  useEffect(() => {
    pageIns.current = Taro.getCurrentInstance()
    getLeagues()
  }, [])

  return (
    <div className='league'>
      {league && (
        <Collapse icon='arrow-down' iconSize='16' iconColor='#999'>
          <CollapseItem title={league?.name} name='1'>
            {league?.desc}
          </CollapseItem>
        </Collapse>
      )}
      <Cell
        title='赛程'
        isLink
        onClick={() =>
          Taro.navigateTo({
            url: `/pages/schedule/index?leagueId=${pageIns.current.router.params?.leagueId}`,
          })
        }
      />
      <Cell
        title='积分榜'
        isLink
        onClick={() =>
          Taro.navigateTo({
            url: `/pages/ranking/index?leagueId=${pageIns.current.router.params?.leagueId}`,
          })
        }
      />
      <Cell
        title='球员榜'
        isLink
        onClick={() =>
          Taro.navigateTo({
            url: `/pages/player/index?leagueId=${pageIns.current.router.params?.leagueId}`,
          })
        }
      />
    </div>
  )
}
export default Index
