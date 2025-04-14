import { renderHook } from '@testing-library/react'
import { waitFor } from '@testing-library/dom'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import {
    useTasks,
    useTaskById,
    useTasksByBoard,
    useUserTasks,
} from '../../api/tasks/queries'
import { createWrapper } from '../../utils/testUtils'

jest.mock('../../api/boards', () => ({
    useBoards: () => ({
        data: [{ id: 1, name: 'Доска 1' }],
    }),
}))

const server = setupServer(
    rest.get('/api/v1/tasks', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ data: [{ id: '1', title: 'Test' }] }))
    }),
    rest.get('/api/v1/tasks/99', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ data: { id: '99', title: 'Test' } }))
    }),
    rest.get('/api/v1/boards/1', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ data: [{ id: '1', title: 'Task 1', boardId: 1 }] }))
    }),
    rest.get('/api/v1/users/77/tasks', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ data: [{ id: 'task-1', title: 'От юзера' }] }))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('queries.ts hooks', () => {
    it('useTasks — возвращает задачи', async () => {
        const wrapper = createWrapper()
        const { result } = renderHook(() => useTasks(), { wrapper })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data?.[0].title).toBe('Test')
    })

    it('useTaskById — возвращает задачу по ID', async () => {
        const wrapper = createWrapper()
        const { result } = renderHook(() => useTaskById('99'), { wrapper })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data?.title).toBe('Test')
    })

    it('useTasksByBoard — возвращает задачи с доски с boardName', async () => {
        const wrapper = createWrapper()
        const { result } = renderHook(() => useTasksByBoard('1'), { wrapper })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data?.[0].title).toBe('Task 1')
        expect(result.current.data?.[0].boardName).toBe('Доска 1')
    })

    it('useTasksByBoard — fallback на пустой useBoards', () => {
        ; (require('../../api/boards') as any).useBoards = () => ({})
        const wrapper = createWrapper()
        renderHook(() => useTasksByBoard('1'), { wrapper })
    })

    it('useTasksByBoard — не находит имя доски, возвращает "—"', async () => {
        ; (require('../../api/boards') as any).useBoards = () => ({ data: [] })
        const wrapper = createWrapper()
        const { result } = renderHook(() => useTasksByBoard('1'), { wrapper })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data?.[0].boardName).toBe('—')
    })

    it('useTasksByBoard — НЕ выполняет запрос, если boardId пустой', async () => {
        const wrapper = createWrapper()
        const { result } = renderHook(() => useTasksByBoard(''), { wrapper })

        expect(result.current.isFetching).toBe(false)
        expect(result.current.data).toBeUndefined()
    })

    it('useUserTasks — возвращает задачи пользователя', async () => {
        const wrapper = createWrapper()
        const { result } = renderHook(() => useUserTasks('77'), { wrapper })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data?.[0].title).toBe('От юзера')
    })
})
