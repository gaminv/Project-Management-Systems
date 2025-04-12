// client/api/tasks.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from './api'
import { Task } from '../types'
import { useBoards } from './boards'

export interface UpdateStatusVars {
    taskId: string
    status: string
    order?: number
}

export interface CreateTaskRequest {
    Title: string
    Description: string
    Priority: 'Low' | 'Medium' | 'High'
    AssigneeID: number
    BoardID: number
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
    assigneeId: number     // ✅ not string
    boardId: number        // ✅ not string
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
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (task: CreateTaskRequest) => {
            const res = await api.post('/tasks/create', task)
            return res.data
        },
        onSuccess: (_data, variables) => {
            // Обновляем задачи после создания
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
            queryClient.invalidateQueries({ queryKey: ['tasks', variables.BoardID] })
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
            const res = await api.put(`/tasks/update/${taskId}`, {
                Title: data.title,
                Description: data.description,
                Priority: data.priority,
                Status: data.status,
                AssigneeID: data.assigneeId,
                BoardID: data.boardId,
            })
            return res.data
        },
    })
}