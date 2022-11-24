import { useEffect, useState, useRef } from 'react'
import Taro from '@tarojs/taro'
import { Row, Col } from '@nutui/nutui-react-taro'
import { getAllRound, getAllTeam } from '@/servers/league'
import './index.scss'

function Index() {
  const pageIns = useRef<any>()
  const [rounds, setRounds] = useState<any>({})
  const [teams, setTeams] = useState<any[]>([])

  async function getRounds() {
    const { leagueId = 0 } = pageIns.current.router.params
    const list = await getAllTeam({ leagueId })
    getAllRound({ leagueId }).then(res => {
      for (const key in res) {
        if (Object.prototype.hasOwnProperty.call(res, key)) {
          const item = res[key]
          const roundName = item.roundName
          if (!rounds[roundName]) {
            rounds[roundName] = []
          }
          rounds[roundName].push(item)
        }
      }
      setRounds(rounds)
      setTeams(list)
    })
  }
  useEffect(() => {
    pageIns.current = Taro.getCurrentInstance()
    getRounds()
  }, [])
  return (
    <div>
      <Row>
        <Col span='6'>时间</Col>
        <Col span='6' style={{ textAlign: 'right' }}>
          主队
        </Col>
        <Col span='6' style={{ textAlign: 'center' }}>
          比分
        </Col>
        <Col span='6' style={{ textAlign: 'left' }}>
          客队
        </Col>
      </Row>
      {Object.keys(rounds).map(key => (
        <div key={key}>
          <Row key={key}>
            <Col span='24' className='round-name'>
              {key}
            </Col>
          </Row>
          {rounds[key].length > 0 &&
            rounds[key].map((item, index) => (
              <Row key={index + key}>
                <Col span='6' style={{ fontSize: 14 }}>
                  {item.roundDate}
                </Col>
                <Col span='6' style={{ textAlign: 'right' }}>
                  {teams.find(v => Number(v.id) === item.homeTeam)?.name}
                </Col>
                <Col span='6' style={{ textAlign: 'center' }}>
                  {item.homeTeamScore}:{item.guestTeamScore}
                </Col>
                <Col span='6' style={{ textAlign: 'left' }}>
                  {teams.find(v => Number(v.id) === item.guestTeam)?.name}
                </Col>
              </Row>
            ))}
        </div>
      ))}
    </div>
  )
}
export default Index
