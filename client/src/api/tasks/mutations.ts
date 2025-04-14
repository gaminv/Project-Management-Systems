import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query'
import api from '../api'
import { CreateTaskRequest, UpdateStatusVars, UpdateTaskData } from './types'

type CreateResponse = any 

export const useCreateTask = (): UseMutationResult<CreateResponse, unknown, CreateTaskRequest> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (task: CreateTaskRequest) => {
            const controller = new AbortController()
            const res = await api.post('/tasks/create', task, {
                signal: controller.signal,
            })
            return res.data
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
            queryClient.invalidateQueries({ queryKey: ['tasks', variables.BoardID] })
        },
    })
}

export const useUpdateTask = (): UseMutationResult<any, unknown, { taskId: string; data: UpdateTaskData }> => {
    return useMutation({
        mutationFn: async ({ taskId, data }) => {
            const controller = new AbortController()
            const res = await api.put(`/tasks/update/${taskId}`, {
                Title: data.title,
                Description: data.description,
                Priority: data.priority,
                Status: data.status,
                AssigneeID: data.assigneeId,
                BoardID: data.boardId,
            }, {
                signal: controller.signal,
            })
            return res.data
        },
    })
}

export const useUpdateTaskStatus = (): UseMutationResult<any, unknown, UpdateStatusVars> => {
    return useMutation({
        mutationFn: async ({ taskId, status, order }) => {
            const controller = new AbortController()
            const serverStatus =
                status === 'todo' ? 'Backlog' :
                    status === 'in-progress' ? 'InProgress' :
                        'Done'

            const res = await api.put(`/tasks/updateStatus/${taskId}`, {
                status: serverStatus,
                order,
            }, {
                signal: controller.signal,
            })
            return res.data
        },
    })
}
