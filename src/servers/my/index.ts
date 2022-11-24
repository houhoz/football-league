import createFetch from '@/utils/request'

export const myGoal = createFetch('football/mygoal/', 'GET')
export const myTeam = createFetch('football/team/', 'GET')
