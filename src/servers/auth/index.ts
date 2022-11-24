import createFetch from '@/utils/request'

export const userLogin = createFetch('football/login/', 'POST')
export const myGoal = createFetch('football/mygoal/', 'GET')
