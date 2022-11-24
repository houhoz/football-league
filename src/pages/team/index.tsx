import { useEffect, useState } from 'react'
import { Row, Col, Cell } from '@nutui/nutui-react-taro'
import { myTeam } from '@/servers/my'

import './index.scss'

function Index() {
  const [team, setTeam] = useState<any>(null)
  async function getMyTeam() {
    try {
      const res = await myTeam()
      setTeam(res?.team)
    } catch (error) {
      console.log('error :>> ', error)
    }
  }

  useEffect(() => {
    getMyTeam()
  }, [])
  return (
    <>
      {team && (
        <>
          <Cell title={team.name} desc={`队长：${team.captain}`} />
          <Row>
            <Col span='8' style={{ textAlign: 'center' }}>
              序号
            </Col>
            <Col span='16' style={{ textAlign: 'left' }}>
              球员
            </Col>
          </Row>
          {team.member.map((item, index) => (
            <Row key={index}>
              <Col span='8' style={{ textAlign: 'center' }}>
                {index + 1}
              </Col>
              <Col span='16' style={{ textAlign: 'left' }}>
                {item}
              </Col>
            </Row>
          ))}
        </>
      )}
    </>
  )
}
export default Index
