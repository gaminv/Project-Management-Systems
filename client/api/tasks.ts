// client/api/tasks.ts

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


export interface UserTask {
    id: string
    title: string
    description: string
    status: string
    priority: string
    boardName: string
}

export interface UpdateTaskData {
    title: string
    description: string
    priority: 'Low' | 'Medium' | 'High'
    status: 'Backlog' | 'InProgress' | 'Done'
    assigneeId: string
    boardId: string
}

export const useTasksByBoard = (boardId: string) => {
    return useQuery<Task[]>({
        queryKey: ['tasks', boardId],
        queryFn: async () => {
            const res = await api.get(`/boards/${boardId}`)
            return res.data.data.map((task: any) => ({
                ...task,
                projectId: boardId, 
            }))
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

export const useUserTasks = (userId: string) => {
    return useQuery<UserTask[]>({
        queryKey: ['userTasks', userId],
        queryFn: async () => {
            const res = await api.get(`/users/${userId}/tasks`)
            return res.data.data as UserTask[]
        },
        enabled: !!userId,
    })
}

export const useUpdateTask = () => {
    return useMutation({
        mutationFn: async ({
            taskId,
            data,
        }: {
            taskId: string
            data: UpdateTaskData
        }) => {
            const res = await api.put(`/tasks/update/${taskId}`, data)
            return res.data
        },
    })
}