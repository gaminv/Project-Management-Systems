import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api'
import { CreateTaskRequest, UpdateStatusVars, UpdateTaskData } from './types'

export const useCreateTask = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (task: CreateTaskRequest) => {
            const res = await api.post('/tasks/create', task)
            return res.data
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
            queryClient.invalidateQueries({ queryKey: ['tasks', variables.BoardID] })
        },
    })
}

export const useUpdateTask = () => {
    return useMutation({
        mutationFn: async ({ taskId, data }: { taskId: string; data: UpdateTaskData }) => {
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

export const useUpdateTaskStatus = () => {
    return useMutation({
        mutationFn: async ({ taskId, status, order }: UpdateStatusVars) => {
            const serverStatus =
                status === 'todo' ? 'Backlog' :
                    status === 'in-progress' ? 'InProgress' :
                        'Done'

            const res = await api.put(`/tasks/updateStatus/${taskId}`, {
                status: serverStatus,
                order,
            })
            return res.data
        },
    })
}
