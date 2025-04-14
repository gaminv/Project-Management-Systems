import { useQuery, UseQueryResult } from '@tanstack/react-query'
import api from './api'

export interface Team {
    id: string
    name: string
    description: string
    usersCount: number
    boardsCount: number
}

export const useTeams = (): UseQueryResult<Team[]> => {
    return useQuery<Team[]>({
        queryKey: ['teams'],
        queryFn: async ({ signal }) => {
            const res = await api.get('/teams', { signal })
            return res.data.data as Team[]
        },
    })
}

export interface TeamDetails {
    id: string
    name: string
    description: string
    users: {
        id: string
        fullName: string
        email: string
        description: string
        avatarURL: string
    }[]
    boards: {
        id: string
        name: string
        description: string
    }[]
}

export const useTeam = (teamId: string): UseQueryResult<TeamDetails> => {
    return useQuery<TeamDetails>({
        queryKey: ['team', teamId],
        queryFn: async ({ signal }) => {
            const res = await api.get(`/teams/${teamId}`, { signal })
            return res.data.data as TeamDetails
        },
        enabled: !!teamId,
    })
}
