import { useEffect, useState, useRef } from 'react'
import { Button, Cell, InputNumber, Picker } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import { getAllTeam } from '@/servers/league'
import { myTeam } from '@/servers/my'
import { createRoundNode, getRoundNode, updateRoundNode } from '@/servers/match'
import './index.scss'

const types = [
  { text: '进球', value: 'goal' },
  { text: '红牌', value: 'red' },
  { text: '黄牌', value: 'yellow' },
]

const goalTypes = [
  { text: '是', value: 'own' },
  { text: '否', value: 'normal' },
]

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
  const [type, setType] = useState({ value: 'goal', text: '进球' })
  const [happenTime, setHappenTime] = useState(1)
  const [goalPlayer, setGoalPlayer] = useState({ value: '', text: '' })
  const [assistPlayer, setAssistPlayer] = useState({ value: '', text: '' })
  const [redCard, setRedCard] = useState({ value: '', text: '' })
  const [yellowCard, setYellowCard] = useState({ value: '', text: '' })
  const [goalType, setGoalType] = useState({ value: 'normal', text: '否' })

  const submit = async () => {
    try {
      const { leagueId, matchId, nodeId } = pageIns.current.router.params
      const firstRoundNode = {
        teamId: team.value,
        happenTime,
        type: type.value,
        goalType: goalType.value,
        goalPlayer: goalPlayer.value,
        assistPlayer: assistPlayer.value,
        redCard: redCard.value,
        yellowCard: yellowCard.value,
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
      const list = res.team.member.map(item => ({
        value: item.id,
        text: item.name,
      }))
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
      const { leagueId, homeTeam, guestTeam } = pageIns.current.router.params
      const teamList = await getAllTeam({ leagueId })
      const list = teamList
        .map(item => ({ value: item.id, text: item.name }))
        .filter(
          item =>
            item.value === Number(homeTeam) || item.value === Number(guestTeam)
        )
      const res = await getRoundNode({ id, leagueId })
      const [node] = res
      const {
        assistPlayer,
        goalPlayer,
        goalType,
        happenTime,
        redCard,
        teamId,
        type,
        yellowCard,
      } = node
      const curTeam = list.find(item => item.value === teamId)
      getPlayer(teamId)
      setHappenTime(happenTime)
      setTeams(list)
      setTeam({ ...curTeam })
      setType({
        value: type,
        text: types.find(item => item.value === type)?.text || '',
      })
      if (type === 'goal') {
        setGoalPlayer({ value: goalPlayer, text: goalPlayer })
        setAssistPlayer({ value: assistPlayer, text: assistPlayer })
        setGoalType({
          value: goalType,
          text:
            goalTypes.find(item => item.value === node.goalType)?.text || '',
        })
      } else if (type === 'red') {
        setRedCard({ value: redCard, text: redCard })
      } else {
        setYellowCard({ value: yellowCard, text: yellowCard })
      }
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
        setYellowCard({ value: '', text: '' })
        setRedCard({ value: '', text: '' })
        break
      case 'type':
        setType({ value, text })
        setAssistPlayer({ value: '', text: '' })
        setGoalPlayer({ value: '', text: '' })
        setYellowCard({ value: '', text: '' })
        setRedCard({ value: '', text: '' })
        if (type !== 'goal') {
          setGoalType({ value: '', text: '' })
        }
        break
      case 'goalPlayer':
        setGoalPlayer({ value, text })
        break
      case 'assistPlayer':
        setAssistPlayer({ value, text })
        break
      case 'goalType':
        setGoalType({ value, text })
        break
      case 'yellowCard':
        setYellowCard({ value, text })
        break
      case 'redCard':
        setRedCard({ value, text })
        break

      default:
        break
    }
  }
  return (
    <div className='node'>
      <Cell
        title='类型'
        desc={type.text}
        onClick={() =>
          setPickerConfig({
            isVisible: true,
            type: 'type',
            listData: types,
          })
        }
      />
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
      {type.value === 'goal' && (
        <Cell
          title='是否乌龙'
          desc={goalType.text}
          onClick={() =>
            setPickerConfig({
              isVisible: true,
              type: 'goalType',
              listData: goalTypes,
            })
          }
        />
      )}
      {team.value && type.value === 'goal' && (
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
      {team.value && type.value === 'goal' && goalType.value === 'normal' && (
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
      {team.value && type.value === 'red' && (
        <Cell
          title='请选择红牌队员'
          desc={redCard.text}
          onClick={() =>
            setPickerConfig({
              isVisible: true,
              type: 'redCard',
              listData: players,
            })
          }
        />
      )}
      {team.value && type.value === 'yellow' && (
        <Cell
          title='请选择黄牌队员'
          desc={yellowCard.text}
          onClick={() =>
            setPickerConfig({
              isVisible: true,
              type: 'yellowCard',
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
