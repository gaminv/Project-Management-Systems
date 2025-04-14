import { useQuery, UseQueryResult } from '@tanstack/react-query'
import api from './api'
import { Board } from '../types/types'

export const useBoards = (): UseQueryResult<Board[]> => {
    return useQuery<Board[]>({
        queryKey: ['boards'],
        queryFn: async ({ signal }) => {
            const res = await api.get('/boards', { signal })
            return res.data.data
        },
    })
}
