import { useQuery } from '@tanstack/react-query'
import api from '../api'
import { Task } from '../../types'
import { useBoards } from '../boards'
import { UserTask } from './types'

export const useTasks = () => {
    return useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: async () => {
            const res = await api.get('/tasks')
            return res.data.data
        },
    })
}

export const useTaskById = (taskId: string) => {
    return useQuery<Task>({
        queryKey: ['task', taskId],
        queryFn: async () => {
            const res = await api.get(`/tasks/${taskId}`)
            return res.data.data
        },
        enabled: !!taskId,
    })
}

export const useTasksByBoard = (boardId: string) => {
    const { data: boards = [] } = useBoards()

    return useQuery<Task[]>({
        queryKey: ['tasks', boardId],
        queryFn: async () => {
            const res = await api.get(`/boards/${boardId}`)
            const boardName = boards.find(b => String(b.id) === boardId)?.name || '—'
            return res.data.data.map((task: any) => ({
                ...task,
                boardName: task.boardName ?? boardName,
            }))
        },
        enabled: !!boardId,
    })
}

export const useUserTasks = (userId: string) => {
    return useQuery<UserTask[]>({
        queryKey: ['userTasks', userId],
        queryFn: async () => {
            const res = await api.get(`/users/${userId}/tasks`)
            return res.data.data
        },
        enabled: !!userId,
    })
}
