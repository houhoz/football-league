import { useEffect, useState, useRef } from 'react'
import Taro from '@tarojs/taro'
import { Row, Col } from '@nutui/nutui-react-taro'
import { getLeagueTeamData } from '@/servers/league'
import './index.scss'

function Index() {
  const pageIns = useRef<any>()
  const [teams, setTeams] = useState<any[]>([])
  const getTeamScore = async () => {
    const { leagueId = 0 } = pageIns.current.router.params
    try {
      const list = await getLeagueTeamData({ leagueId })
      setTeams(list)
    } catch (error) {
      console.log('error :>> ', error)
    }
  }
  useEffect(() => {
    pageIns.current = Taro.getCurrentInstance()
    getTeamScore()
  }, [])
  return (
    <>
      <Row className='label-font'>
        <Col span='6' style={{ textAlign: 'center' }}>
          球队
        </Col>
        <Col span='5' style={{ textAlign: 'center' }}>
          队长
        </Col>
        <Col span='5' style={{ textAlign: 'center' }}>
          胜/平/负
        </Col>
        <Col span='4' style={{ textAlign: 'center' }}>
          进/失数
        </Col>
        <Col span='4' style={{ textAlign: 'center' }}>
          积分
        </Col>
      </Row>
      {teams.length > 0 && (
        <>
          {teams.map(item => (
            <Row key={item.id} className='row-font'>
              <Col span='6' style={{ textAlign: 'center' }}>
                {item.name}
              </Col>
              <Col span='5' style={{ textAlign: 'center' }}>
                {item.captain}
              </Col>
              <Col span='5' style={{ textAlign: 'center' }}>
                {item.winNum}/{item.flatNum}/{item.loseNum}
              </Col>
              <Col span='4' style={{ textAlign: 'center' }}>
                {item.goalNum}/{item.loseGoalNum}
              </Col>
              <Col span='4' style={{ textAlign: 'center' }}>
                {item.score}
              </Col>
            </Row>
          ))}
        </>
      )}
    </>
  )
}
export default Index
