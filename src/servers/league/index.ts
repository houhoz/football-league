import createFetch from '@/utils/request'

export const getAllLeague = createFetch('football/allleague/', 'GET')
export const getAllRound = createFetch('football/getAllRound/', 'GET')
export const getAllTeam = createFetch('football/allteam/', 'GET')
export const getLeagueTeamData = createFetch('football/leagueTeamData/', 'GET')
export const getLeagueMemberData = createFetch(
  'football/leagueMemberData/',
  'GET'
)
