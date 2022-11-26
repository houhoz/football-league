import createFetch from '@/utils/request'

export const getRound = createFetch('football/round/', 'GET')
export const createRoundNode = createFetch('football/roundNode/', 'POST')
export const deleteRoundNode = createFetch('football/roundNode/', 'DELETE')
export const getRoundNode = createFetch('football/roundNode/', 'GET')
export const updateRoundNode = createFetch('football/roundNode/', 'PATCH')
export const submitRound = createFetch('football/submitRound/', 'POST')
