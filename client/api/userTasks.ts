// client/api/userTasks.ts
import { useQuery } from '@tanstack/react-query'
import api from './api'
import { Task } from '../types'

export const useUserTasks = (userId: string) => {
    return useQuery<Task[]>({
        queryKey: ['userTasks', userId],
        queryFn: async () => {
            const res = await api.get(`/users/${userId}/tasks`)
            return res.data.data as Task[]
        },
        enabled: !!userId,
    })
}
