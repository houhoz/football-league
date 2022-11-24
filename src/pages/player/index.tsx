import { useEffect, useState, useRef } from 'react'
import Taro from '@tarojs/taro'
import { Tabs, TabPane, Row, Col } from '@nutui/nutui-react-taro'
import { getLeagueMemberData } from '@/servers/league'
import './index.scss'

function Index() {
  const pageIns = useRef<any>()
  const [goals, setGoals] = useState<any[]>([])
  const [assists, setAssists] = useState<any[]>([])
  const [tab1value, setTab1value] = useState('0')

  const getMember = async type => {
    const { leagueId = 0 } = pageIns.current.router.params
    const list = await getLeagueMemberData({ leagueId, type })
    switch (type) {
      case 'goal':
        setGoals(list)
        break
      case 'assist':
        setAssists(list)
        break

      default:
        break
    }
  }

  useEffect(() => {
    pageIns.current = Taro.getCurrentInstance()
    getMember('goal')
    getMember('assist')
  }, [])

  return (
    <Tabs
      type='smile'
      value={tab1value}
      onChange={({ paneKey }) => {
        setTab1value(paneKey)
      }}
    >
      <TabPane title='进球榜'>
        <Row>
          <Col span='8' style={{ textAlign: 'center' }}>
            排名
          </Col>
          <Col span='8' style={{ textAlign: 'center' }}>
            球员
          </Col>
          <Col span='8' style={{ textAlign: 'center' }}>
            进球数
          </Col>
        </Row>
        {goals.length > 0 && (
          <>
            {goals.map((item, index) => (
              <Row key={index}>
                <Col span='8' style={{ textAlign: 'center' }}>
                  {index + 1}
                </Col>
                <Col span='5' style={{ textAlign: 'center' }}>
                  {item.name}
                </Col>
                <Col span='5' style={{ textAlign: 'center' }}>
                  {item.num}
                </Col>
              </Row>
            ))}
          </>
        )}
      </TabPane>
      <TabPane title='助攻榜'>
        <Row>
          <Col span='8' style={{ textAlign: 'center' }}>
            排名
          </Col>
          <Col span='8' style={{ textAlign: 'center' }}>
            球员
          </Col>
          <Col span='8' style={{ textAlign: 'center' }}>
            助攻数
          </Col>
        </Row>
        {assists.length > 0 && (
          <>
            {assists.map((item, index) => (
              <Row key={index}>
                <Col span='8' style={{ textAlign: 'center' }}>
                  {index + 1}
                </Col>
                <Col span='5' style={{ textAlign: 'center' }}>
                  {item.name}
                </Col>
                <Col span='5' style={{ textAlign: 'center' }}>
                  {item.num}
                </Col>
              </Row>
            ))}
          </>
        )}
      </TabPane>
    </Tabs>
  )
}
export default Index
