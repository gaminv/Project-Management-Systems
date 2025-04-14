import { useQuery } from '@tanstack/react-query'
import api from './api'
import { Board } from '../types/types'

export const useBoards = () => {
    return useQuery<Board[]>({
        queryKey: ['boards'],
        queryFn: async () => {
            const res = await api.get('/boards')
            return res.data.data
        },
    })
}
