// src/api/tasks.ts

import { useQuery, useMutation } from '@tanstack/react-query'
import api from './api'
import { Task } from '../types'

export interface UpdateStatusVars {
    taskId: string
    status: string
    order?: number
}

export interface CreateTaskRequest {
    title: string
    description: string
    priority: string
    assigneeId: string
    boardId: string
}

export const useTasksByBoard = (boardId: string) => {
    return useQuery<Task[]>({
        queryKey: ['tasks', boardId],
        queryFn: async () => {
            const res = await api.get(`/boards/${boardId}`)
            return res.data.data as Task[]
        },
        enabled: !!boardId,
    })
}


export const useUpdateTaskStatus = () => {
    return useMutation({
        mutationFn: async ({ taskId, status, order }: UpdateStatusVars) => {
            const serverStatus =
                status === 'todo'
                    ? 'Backlog'
                    : status === 'in-progress'
                        ? 'InProgress'
                        : 'Done'

            const res = await api.put(`/tasks/updateStatus/${taskId}`, {
                status: serverStatus,
                order,
            })
            return res.data
        },
    })
}

export const useCreateTask = () => {
    return useMutation({
        mutationFn: async (task: CreateTaskRequest) => {
            const res = await api.post('/tasks/create', task)
            return res.data
        },
    })
}

export const useTasks = () => {
    return useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: async () => {
            const res = await api.get('/tasks')
            return res.data.data
        },
    })
}
