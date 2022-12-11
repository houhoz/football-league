import { useEffect, useState, useRef } from 'react'
import {
  Button,
  Cell,
  InputNumber,
  Picker,
  Radio,
} from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import { getAllTeam } from '@/servers/league'
import { myTeam } from '@/servers/my'
import { createRoundNode, getRoundNode, updateRoundNode } from '@/servers/match'
import './index.scss'

// const types = [
//   { text: '进球', value: 'goal' },
//   { text: '红牌', value: 'red' },
//   { text: '黄牌', value: 'yellow' },
// ]

function Index() {
  const defaultPickerConfig: any = {
    isVisible: false,
    type: '',
    listData: [],
  }
  const pageIns = useRef<any>()
  const [teams, setTeams] = useState<any[]>([])
  const [players, setPlayers] = useState<any[]>([])
  const [pickerConfig, setPickerConfig] = useState({ ...defaultPickerConfig })
  const [team, setTeam] = useState({ value: '', text: '' })
  const [type, setType] = useState({ value: '', text: '进球' })
  const [happenTime, setHappenTime] = useState(1)
  const [goalPlayer, setGoalPlayer] = useState({ value: '', text: '' })
  const [assistPlayer, setAssistPlayer] = useState({ value: '', text: '' })
  const [goalType, setGoalType] = useState('normal')

  const submit = async () => {
    try {
      const { leagueId, matchId, nodeId } = pageIns.current.router.params
      const firstRoundNode = {
        teamId: team.value,
        happenTime,
        type: 'goal',
        goalType: goalType,
        goalPlayer: goalPlayer.value,
        assistPlayer: assistPlayer.value,
      }
      if (nodeId) {
        const params = {
          leagueId,
          id: matchId,
          roundNode: [
            {
              ...firstRoundNode,
              id: nodeId,
            },
          ],
        }
        await updateRoundNode(params)
        Taro.showToast({
          title: '编辑成功',
          icon: 'none',
        })
        Taro.redirectTo({
          url: `/pages/match/index?matchId=${matchId}&leagueId=${leagueId}`,
        })
      } else {
        const params = {
          leagueId,
          id: matchId,
          roundNode: [
            {
              ...firstRoundNode,
            },
          ],
        }
        await createRoundNode(params)
        Taro.showToast({
          title: '新增成功',
          icon: 'none',
        })
        Taro.redirectTo({
          url: `/pages/match/index?matchId=${matchId}&leagueId=${leagueId}`,
        })
      }
    } catch (error) {
      console.log('error :>> ', error)
    }
  }

  async function getPlayer(teamId) {
    try {
      const res = await myTeam({ teamId })
      const list = res.team.member.map(item => ({ value: item, text: item }))
      setPlayers(list)
    } catch (error) {
      console.log('error :>> ', error)
    }
  }

  const getTeams = async () => {
    try {
      const { leagueId, homeTeam, guestTeam } = pageIns.current.router.params
      const res = await getAllTeam({ leagueId })
      const list = res
        .map(item => ({ value: item.id, text: item.name }))
        .filter(
          item =>
            item.value === Number(homeTeam) || item.value === Number(guestTeam)
        )
      setTeams(list)
    } catch (error) {
      console.log('error :>> ', error)
    }
  }
  const getNode = async id => {
    try {
      const teamList = await getAllTeam({ leagueId: 1 })
      const list = teamList.map(item => ({ value: item.id, text: item.name }))
      const res = await getRoundNode({ id })
      const [node] = res
      const curTeam = list.find(item => item.value === node.teamId)
      getPlayer(curTeam.value)
      setGoalPlayer({ value: node.goalPlayer, text: node.goalPlayer })
      setAssistPlayer({ value: node.assistPlayer, text: node.assistPlayer })
      setTeams(list)
      setTeam({ ...curTeam })
      setHappenTime(node.happenTime)
      setGoalType(node.goalType)
    } catch (error) {
      console.log('error :>> ', error)
    }
  }
  useEffect(() => {
    pageIns.current = Taro.getCurrentInstance()
    const { nodeId } = pageIns.current.router.params
    if (nodeId) {
      getNode(nodeId)
      Taro.setNavigationBarTitle({
        title: '编辑比赛节点',
      })
    } else {
      getTeams()
    }
  }, [])
  const confirmPicker = (_values, options: any[]) => {
    const [{ value, text }] = options
    const { type } = pickerConfig
    switch (type) {
      case 'team':
        setTeam({ value, text })
        getPlayer(value)
        setGoalPlayer({ value: '', text: '' })
        setAssistPlayer({ value: '', text: '' })
        break
      case 'type':
        setType({ value, text })
        break
      case 'goalPlayer':
        setGoalPlayer({ value, text })
        break
      case 'assistPlayer':
        setAssistPlayer({ value, text })
        break

      default:
        break
    }
  }
  return (
    <div className='node'>
      <Cell title='类型' desc={type.text} />
      <Cell
        title='请选择球队'
        desc={team.text}
        onClick={() =>
          setPickerConfig({
            isVisible: true,
            type: 'team',
            listData: teams,
          })
        }
      />
      <Cell
        title='请输入发生时间'
        linkSlot={
          <InputNumber
            onChangeFuc={(val: number) => setHappenTime(val)}
            modelValue={happenTime}
          />
        }
      />
      <Cell
        title='是否乌龙'
        linkSlot={
          <Radio.RadioGroup
            value={goalType}
            onChange={(v: string) => setGoalType(v)}
            direction='horizontal'
          >
            <Radio value='normal'>否</Radio>
            <Radio value='own'>是</Radio>
          </Radio.RadioGroup>
        }
      />
      {team.value && (
        <Cell
          title='请选择进球队员'
          desc={goalPlayer.text}
          onClick={() =>
            setPickerConfig({
              isVisible: true,
              type: 'goalPlayer',
              listData: players,
            })
          }
        />
      )}
      {team.value && goalType === 'normal' && (
        <Cell
          title='请选择助攻队员'
          desc={assistPlayer.text}
          onClick={() =>
            setPickerConfig({
              isVisible: true,
              type: 'assistPlayer',
              listData: players,
            })
          }
        />
      )}
      <Button type='primary' size='large' onClick={submit}>
        确定
      </Button>
      <Picker
        isVisible={pickerConfig.isVisible}
        listData={pickerConfig.listData}
        onConfirm={(values, list) => confirmPicker(values, list)}
        onClose={() => setPickerConfig({ ...defaultPickerConfig })}
      />
    </div>
  )
}

export default Index
