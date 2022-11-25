import { useEffect, useState, useRef } from 'react'
import { Cell, CellGroup } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import { getRound } from '@/servers/match'
import { getAllTeam } from '@/servers/league'

import './index.scss'

function Index() {
  const pageIns = useRef<any>()
  const [data, setData] = useState<any>(null)
  const [teams, setTeams] = useState<any[]>([])
  const getData = async () => {
    const { leagueId, matchId } = pageIns.current.router.params
    try {
      const list = await getAllTeam({ leagueId })
      const res = await getRound({ leagueId, id: matchId })
      setTeams(list)
      setData(res[matchId])
    } catch (error) {
      console.log('error :>> ', error)
    }
  }

  useEffect(() => {
    pageIns.current = Taro.getCurrentInstance()
    getData()
  }, [])
  return (
    <div className='match-wrap'>
      <div className='match-header'>
        <div className=''>
          {teams.find(v => Number(v.id) === data?.homeTeam)?.name}
        </div>
        <div className=''>
          {data?.homeTeamGoal}-{data?.guestTeamGoal}
        </div>
        <div className=''>
          {teams.find(v => Number(v.id) === data?.guestTeam)?.name}
        </div>
      </div>
      <CellGroup title='关键节点'>
        {data &&
          data.nodes.length > 0 &&
          data.nodes.map(item => {
            return (
              <Cell
                key={item.id}
                title={
                  <div>
                    第{item.happen_time}分钟，
                    {item.goal_player}（
                    {teams.find(v => Number(v.id) === item?.team_id)?.name}
                    ）进球{item.assist_player && `，${item.assist_player} 助攻`}
                  </div>
                }
              />
            )
          })}
      </CellGroup>
    </div>
  )
}

export default Index
