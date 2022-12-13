import createFetch from '@/utils/request'

export const userLogin = createFetch('football/login/', 'POST')
export const wxLogin = createFetch('football/wxlogin/', 'POST')
export const bindExistPlayer = createFetch('football/bindExistPlayer/', 'POST')
