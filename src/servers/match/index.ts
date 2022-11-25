import createFetch from '@/utils/request'

export const getRound = createFetch('football/round/', 'GET')
