import { useEffect, useState, useRef } from 'react'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import { Button, Row, Col, Cell, CellGroup } from '@nutui/nutui-react-taro'
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
          const { roundDate, roundName, roundId } = item
          if (!rounds[roundId]) {
            rounds[roundId] = { roundDate, roundName, items: [] }
          }
          rounds[roundId].items.push({ ...item, matchId: key })
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
      <Row className='label-font' style={{ marginBottom: 20 }}>
        <Col span='9' style={{ textAlign: 'right' }}>
          主队
        </Col>
        <Col span='6' style={{ textAlign: 'center' }}>
          比分
        </Col>
        <Col span='9' style={{ textAlign: 'left' }}>
          客队
        </Col>
      </Row>
      {teams.length > 0 &&
        Object.keys(rounds).length > 0 &&
        Object.values(rounds).map((item: any) => (
          <CellGroup
            key={item.roundDate}
            titleSlot={
              <>
                <Row className='round-name'>
                  <Col span='24'>{item.roundName}</Col>
                </Row>
                <Row className='round-date'>
                  <Col span='24'>{item.roundDate}</Col>
                </Row>
              </>
            }
          >
            {item.items.length > 0 &&
              item.items.map((term: any) => {
                const homeTeam = teams.find(v => Number(v.id) === term.homeTeam)
                const guestTeam = teams.find(
                  v => Number(v.id) === term.guestTeam
                )
                return (
                  <Cell
                    size='large'
                    key={term.matchId}
                    isLink
                    center
                    onClick={() => {
                      const { leagueId } = pageIns.current.router.params
                      Taro.navigateTo({
                        url: `/pages/match/index?matchId=${term.matchId}&leagueId=${leagueId}`,
                      })
                    }}
                    title={
                      <Row className='round-row'>
                        <Col span='9'>
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
                        <Col span='6' style={{ textAlign: 'center' }}>
                          {term.finish === 1
                            ? `${term.homeTeamGoal}: ${term.guestTeamGoal}`
                            : '-'}
                        </Col>
                        <Col span='9'>
                          <div className='team-info'>
                            <img
                              style={{ marginRight: 4 }}
                              className='team-logo'
                              src={guestTeam?.logo}
                            />
                            <div>{guestTeam?.name}</div>
                          </div>
                        </Col>
                      </Row>
                    }
                  />
                )
              })}
          </CellGroup>
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
