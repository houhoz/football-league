import { Button, Cell } from '@nutui/nutui-react-taro'
import { createRound } from '@/servers/league'
import './index.scss'

function Index() {
  const submit = async () => {
    const res = await createRound({
      leagueId: '1',
      startDate: '2022-12-03',
      endDate: '2022-12-03',
      number: '10',
    })
  }
  return (
    <div className='nutui-react-demo'>
      <div className='index'>欢迎使用 NutUI React 开发 Taro 多端项目。</div>
      <div className='index'>
        <Button type='primary' className='btn' onClick={() => submit()}>
          NutUI React Button
        </Button>
      </div>
    </div>
  )
}

export default Index
