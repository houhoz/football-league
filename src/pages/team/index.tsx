import { useEffect, useState } from 'react'
import { Cell, CellGroup } from '@nutui/nutui-react-taro'
// import Taro from '@tarojs/taro'
import header from '@/assets/header.png'
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
          <CellGroup title={team.name}>
            {team.member.map((item, index) => (
              <Cell
                // onClick={() =>
                //   Taro.navigateTo({
                //     url: `/pages/data/index?leagueId=1&userId=${item.id}`,
                //   })
                // }
                key={index}
                iconSlot={<img className='header' src={header} />}
                title={<div style={{ marginLeft: 10 }}>{item.name}</div>}
                desc={`${team.captain === item.name ? '队长' : ''}`}
                size='large'
                center
                isLink
              />
            ))}
          </CellGroup>
        </>
      )}
    </>
  )
}
export default Index
