// client/api/teams.ts

import { useQuery } from '@tanstack/react-query'
import api from './api'

export interface Team {
    id: string
    name: string
    description: string
    usersCount: number
    boardsCount: number
}

export const useTeams = () => {
    return useQuery<Team[]>({
        queryKey: ['teams'],
        queryFn: async () => {
            const res = await api.get('/teams')
            return res.data.data as Team[]
        }
    })
}

// =======================================
// Детали команды (GET /teams/:teamId)
// =======================================

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

export const useTeam = (teamId: string) => {
    return useQuery<TeamDetails>({
        queryKey: ['team', teamId],
        queryFn: async () => {
            const res = await api.get(`/teams/${teamId}`)
            return res.data.data as TeamDetails
        },
        enabled: !!teamId,
    })
}
