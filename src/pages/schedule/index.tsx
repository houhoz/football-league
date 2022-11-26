import { useEffect, useState, useRef } from 'react'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import { Row, Col, Button } from '@nutui/nutui-react-taro'
import { getAllRound, getAllTeam } from '@/servers/league'
import team1 from '@/assets/team1.png'
import team2 from '@/assets/team2.png'
import team3 from '@/assets/team3.png'

import './index.scss'

function Index() {
  const pageIns = useRef<any>()
  const [rounds, setRounds] = useState<any>({})
  const [teams, setTeams] = useState<any[]>([])

  async function getRounds() {
    try {
      console.log('rounds :>> ', rounds)
      const { leagueId } = pageIns.current.router.params
      const list = await getAllTeam({ leagueId })
      list.forEach(item => {
        switch (item.id) {
          case 1:
            item.logo = team1
            break
          case 2:
            item.logo = team2
            break
          case 3:
            item.logo = team3
            break
          default:
            break
        }
      })
      const res = await getAllRound({ leagueId })
      for (const key in res) {
        if (Object.prototype.hasOwnProperty.call(res, key)) {
          const item = res[key]
          const roundName = item.roundName
          if (!rounds[roundName]) {
            rounds[roundName] = []
          }
          rounds[roundName].push({ ...item, matchId: key })
        }
      }
      setRounds(rounds)
      setTeams(list)
      Taro.stopPullDownRefresh()
    } catch (error) {
      Taro.stopPullDownRefresh()
      console.log('error :>> ', error)
    }
  }
  usePullDownRefresh(() => {
    setRounds(prevState => {
      for (var key in prevState) {
        delete prevState[key]
      }
      return prevState
    })
    getRounds()
  })
  useEffect(() => {
    pageIns.current = Taro.getCurrentInstance()
    getRounds()
  }, [])
  return (
    <div className='schedule'>
      <Row className='label-font'>
        <Col span='8' style={{ textAlign: 'center' }}>
          时间
        </Col>
        <Col span='6' style={{ textAlign: 'right' }}>
          主队
        </Col>
        <Col span='4' style={{ textAlign: 'center' }}>
          比分
        </Col>
        <Col span='6' style={{ textAlign: 'left' }}>
          客队
        </Col>
      </Row>
      {teams.length > 0 &&
        Object.keys(rounds).length > 0 &&
        Object.keys(rounds).map(key => (
          <div key={key}>
            <Row key={key}>
              <Col span='24' className='round-name'>
                {key}
              </Col>
            </Row>
            {rounds[key].length > 0 &&
              rounds[key].map((item, index) => {
                const homeTeam = teams.find(v => Number(v.id) === item.homeTeam)
                const guestTeam = teams.find(
                  v => Number(v.id) === item.guestTeam
                )

                return (
                  <Row
                    key={index + key}
                    className='round-row'
                    onClick={() => {
                      const { leagueId } = pageIns.current.router.params
                      Taro.navigateTo({
                        url: `/pages/match/index?matchId=${item.matchId}&leagueId=${leagueId}`,
                      })
                    }}
                  >
                    <Col span='8' style={{ textAlign: 'center' }}>
                      {item.roundDate}
                    </Col>
                    <Col span='6'>
                      <div
                        className='team-info'
                        style={{ justifyContent: 'flex-end' }}
                      >
                        <div>{homeTeam?.name}</div>
                        <img
                          style={{ marginLeft: 4 }}
                          className='team-logo'
                          src={homeTeam?.logo}
                        />
                      </div>
                    </Col>
                    <Col span='4' style={{ textAlign: 'center' }}>
                      {item.finish === 1
                        ? `${item.homeTeamGoal}: ${item.guestTeamGoal}`
                        : '-'}
                    </Col>
                    <Col span='6'>
                      <div className='team-info'>
                        <img className='team-logo' src={guestTeam?.logo} />
                        <div style={{ marginRight: 4 }}>{guestTeam?.name}</div>
                      </div>
                    </Col>
                  </Row>
                )
              })}
          </div>
        ))}
      <Button
        type='primary'
        size='large'
        onClick={() =>
          Taro.navigateTo({
            url: `/pages/scheduleAdd/index?leagueId=${pageIns.current.router.params?.leagueId}`,
          })
        }
      >
        新增赛程
      </Button>
    </div>
  )
}
export default Index
