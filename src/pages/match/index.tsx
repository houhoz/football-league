import { useEffect, useState, useRef } from 'react'
import { Button, Cell, CellGroup, Swipe } from '@nutui/nutui-react-taro'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import { getRound, deleteRoundNode, submitRound } from '@/servers/match'
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
      Taro.stopPullDownRefresh()
    } catch (error) {
      Taro.stopPullDownRefresh()
      console.log('error :>> ', error)
    }
  }

  const finishMatch = async () => {
    try {
      const { leagueId, matchId } = pageIns.current.router.params
      await submitRound({ leagueId, id: matchId })
      Taro.showToast({
        title: '完成比赛成功',
        icon: 'none',
      })
      getData()
    } catch (error) {
      console.log('error :>> ', error)
    }
  }

  const deleteNode = async id => {
    try {
      const { leagueId, matchId } = pageIns.current.router.params
      const params = {
        leagueId,
        id: matchId,
        roundNode: [
          {
            id,
          },
        ],
      }
      await deleteRoundNode({ ...params })
      Taro.showToast({
        title: '删除成功',
        icon: 'none',
      })
      const page = Taro.getCurrentPages().pop() //获取当前页面实例
      if (page == undefined || page == null) return
      //调用实例的onLoad方法重新加载数据;
      page.onLoad(page.options)
    } catch (error) {
      console.log('error :>> ', error)
    }
  }

  usePullDownRefresh(() => {
    getData()
  })

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
        {data?.finish > 0 && <div className='tip'>比赛已完结，不可编辑</div>}
      </div>
      <CellGroup title='关键节点'>
        {data &&
          data.nodes &&
          data.nodes.length > 0 &&
          data.nodes.map((item: any) => {
            return (
              <Swipe
                rightAction={
                  <>
                    <Button
                      type='info'
                      shape='square'
                      disabled={data?.finish}
                      onClick={() => {
                        const { leagueId, matchId } =
                          pageIns.current.router.params
                        const homeTeam = teams.find(
                          v => Number(v.id) === data?.homeTeam
                        )?.id
                        const guestTeam = teams.find(
                          v => Number(v.id) === data?.guestTeam
                        )?.id
                        Taro.navigateTo({
                          url: `/pages/nodeAdd/index?leagueId=${leagueId}&matchId=${matchId}&nodeId=${item.id}&homeTeam=${homeTeam}&guestTeam=${guestTeam}`,
                        })
                      }}
                    >
                      编辑
                    </Button>
                    <Button
                      disabled={data?.finish}
                      type='primary'
                      shape='square'
                      onClick={() => deleteNode(item.id)}
                    >
                      删除
                    </Button>
                  </>
                }
              >
                <Cell
                  key={item.id}
                  title={
                    item.type === 'goal'
                      ? `第${item.happenTime}分钟，
                        ${item.goalPlayer}（
                        ${teams.find(v => Number(v.id) === item?.teamId)?.name}
                        ）进球${item.goalType === 'own' ? '（乌龙）' : ''}
                        ${item.assistPlayer ? `，${item.assistPlayer}助攻` : ''}
                      `
                      : `第${item.happenTime}分钟，
                      ${item.type === 'red' ? item.redCard : item.yellowCard}（
                      ${teams.find(v => Number(v.id) === item?.teamId)?.name}
                      ）${item.type === 'red' ? '红牌' : '黄牌'}
                    `
                  }
                />
              </Swipe>
            )
          })}
      </CellGroup>
      <Button
        type='primary'
        size='large'
        disabled={data?.finish}
        onClick={() => {
          const { leagueId, matchId } = pageIns.current.router.params
          const homeTeam = teams.find(v => Number(v.id) === data?.homeTeam)?.id
          const guestTeam = teams.find(
            v => Number(v.id) === data?.guestTeam
          )?.id
          Taro.navigateTo({
            url: `/pages/nodeAdd/index?leagueId=${leagueId}&matchId=${matchId}&homeTeam=${homeTeam}&guestTeam=${guestTeam}`,
          })
        }}
      >
        新增节点
      </Button>
      <Button
        disabled={data?.finish}
        type='info'
        size='large'
        onClick={finishMatch}
      >
        完结比赛
      </Button>
    </div>
  )
}

export default Index
