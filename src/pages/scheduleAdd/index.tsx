import { useEffect, useState, useRef } from 'react'
import Taro from '@tarojs/taro'
import { Button, Cell, Picker, Calendar } from '@nutui/nutui-react-taro'
import { createRound } from '@/servers/league'
import './index.scss'

const listData = new Array(30)
  .fill(0)
  .map((_item, index) => ({ value: index + 1, text: `第${index + 1}轮` }))

function Index() {
  const pageIns = useRef<any>()
  const [round, setRound] = useState({ value: '', text: '' })
  const [isVisible, setIsVisible] = useState(false)
  const [isVisible1, setIsVisible1] = useState(false)
  const [date, setDate] = useState('')
  const [dateWeek, setDateWeek] = useState('')
  const submit = async () => {
    const { leagueId } = pageIns.current.router.params
    await createRound({
      number: round.value,
      startDate: date,
      leagueId,
    })
    Taro.showToast({
      title: '新增成功',
      icon: 'none',
    })
    Taro.redirectTo({
      url: `/pages/schedule/index?leagueId=${leagueId}`,
    })
  }
  const openSwitch = () => {
    setIsVisible1(true)
  }

  const closeSwitch = () => {
    setIsVisible1(false)
  }

  const setChooseValue = (param: string) => {
    setDate(param[3])
    setDateWeek(param[4])
  }
  useEffect(() => {
    pageIns.current = Taro.getCurrentInstance()
  }, [])

  const confirmPicker = (_values, options: any[]) => {
    const [{ value, text }] = options
    setRound({ value, text })
  }
  return (
    <>
      <Cell
        title='选择时间'
        desc={date ? `${date} ${dateWeek}` : '请选择'}
        onClick={openSwitch}
      />
      <Cell
        title='选择轮次'
        desc={round.text}
        onClick={() => setIsVisible(true)}
      />
      <Picker
        isVisible={isVisible}
        listData={listData}
        onConfirm={(values, list) => confirmPicker(values, list)}
        onClose={() => setIsVisible(false)}
      />
      <Calendar
        visible={isVisible1}
        defaultValue={date}
        startDate='2022-01-11'
        endDate='2029-11-30'
        onClose={closeSwitch}
        onChoose={setChooseValue}
      />
      <Button type='primary' size='large' onClick={submit}>
        确定
      </Button>
    </>
  )
}

export default Index
