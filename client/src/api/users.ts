// client/api/users.ts
import { useQuery } from '@tanstack/react-query'
import api from './api'
import { User } from '../types/types'

export const useUsers = () => {
    return useQuery<User[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await api.get('/users')
            return res.data.data
        },
    })
}
