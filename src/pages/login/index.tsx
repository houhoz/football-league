import { useState } from 'react'
import { Button, Input } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import { userLogin } from '@/servers/auth'
import './index.scss'

function Index() {
  const { showToast, setStorageSync, reLaunch } = Taro
  const [name, setName] = useState({
    value: '',
    errorMessage: '',
  })
  const [password, setPassword] = useState({
    value: '',
    errorMessage: '',
  })
  const submit = async () => {
    if (!name.value) {
      return setName({ ...name, errorMessage: '用户名必填' })
    }
    if (!password.value) {
      return setPassword({ ...password, errorMessage: '密码必填' })
    }
    try {
      const res = await userLogin({
        name: name.value,
        password: password.value,
      })
      showToast({
        title: '登录成功',
      })
      setStorageSync('name', res.name)
      reLaunch({ url: '/pages/leagues/index' })
    } catch (error) {
      console.log('error :>> ', error)
    }
  }
  return (
    <>
      <Input
        label='用户名'
        required
        errorMessage={name.errorMessage}
        placeholder='请输入'
        change={val => {
          if (val) {
            setName({ errorMessage: '', value: val })
          } else {
            setName({ errorMessage: '', value: '' })
          }
        }}
      />
      <Input
        label='密码'
        required
        errorMessage={password.errorMessage}
        placeholder='请输入'
        change={val => {
          if (val) {
            setPassword({ errorMessage: '', value: val })
          } else {
            setPassword({ errorMessage: '', value: '' })
          }
        }}
      />
      <Button type='info' size='large' onClick={submit}>
        登录
      </Button>
    </>
  )
}
export default Index
