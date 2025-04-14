import { useQuery, UseQueryResult } from '@tanstack/react-query'
import api from './api'
import { User } from '../types/types'

export const useUsers = (): UseQueryResult<User[]> => {
    return useQuery<User[]>({
        queryKey: ['users'],
        queryFn: async ({ signal }) => {
            const res = await api.get('/users', { signal })
            return res.data.data
        },
    })
}
