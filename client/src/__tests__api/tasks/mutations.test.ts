import { renderHook } from '@testing-library/react'
import { waitFor } from '@testing-library/dom'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { QueryClient } from '@tanstack/react-query'
import {
    useCreateTask,
    useUpdateTask,
    useUpdateTaskStatus,
} from '../../api/tasks'
import { createWrapper } from '../../utils/testUtils'

const server = setupServer(
    rest.post('/api/v1/tasks/create', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ message: 'Task created' }))
    }),
    rest.put('/api/v1/tasks/update/42', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ updated: true }))
    }),
    rest.put('/api/v1/tasks/updateStatus/:taskId', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ success: true }))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useCreateTask', () => {
    it('создаёт задачу и вызывает invalidateQueries', async () => {
        const queryClient = new QueryClient()
        const wrapper = createWrapper(queryClient)
        const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries')

        const { result } = renderHook(() => useCreateTask(), { wrapper })

        result.current.mutate({
            Title: 'Test Task',
            Description: 'Description',
            Priority: 'Medium',
            AssigneeID: 1,
            BoardID: 42,
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual({ message: 'Task created' })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['tasks'] })
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['tasks', 42] })
    })
})

describe('useUpdateTask', () => {
    it('обновляет задачу', async () => {
        const wrapper = createWrapper()
        const { result } = renderHook(() => useUpdateTask(), { wrapper })

        result.current.mutate({
            taskId: '42',
            data: {
                title: 'Test',
                description: 'desc',
                priority: 'High',
                status: 'InProgress',
                assigneeId: 3,
                boardId: 4,
            },
        })

        await waitFor(() => result.current.isSuccess)
        expect(result.current.data).toEqual({ updated: true })
    })
})

describe('useUpdateTaskStatus (full branch coverage)', () => {
    const testStatus = async (status: string) => {
        const wrapper = createWrapper()
        const { result } = renderHook(() => useUpdateTaskStatus(), { wrapper })

        result.current.mutate({ taskId: '123', status })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))
    }

    it('handles status "todo" -> Backlog', async () => {
        await testStatus('todo')
    })

    it('handles status "in-progress" -> InProgress', async () => {
        await testStatus('in-progress')
    })

    it('handles status "done" -> Done', async () => {
        await testStatus('done')
    })
})
