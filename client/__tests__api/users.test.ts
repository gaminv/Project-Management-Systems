import { renderHook } from '@testing-library/react'
import { waitFor } from '@testing-library/dom'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { useUsers } from '../api/users'
import { createWrapper } from '../utils/testUtils'

const mockUsers = [
    {
        id: '1',
        fullName: 'Александр Ветров',
        email: 'vetrov@avito.ru',
        avatarUrl: 'https://example.com/avatar.png',
    },
]

const server = setupServer(
    rest.get('/api/v1/users', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ data: mockUsers }))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useUsers', () => {
    it('возвращает список пользователей', async () => {
        const wrapper = createWrapper()
        const { result } = renderHook(() => useUsers(), { wrapper })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data?.[0].fullName).toBe('Александр Ветров')
    })
})
