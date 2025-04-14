import { renderHook } from '@testing-library/react'
import { waitFor } from '@testing-library/dom'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { useTeams, useTeam } from '../api/teams'
import { createWrapper } from '../utils/testUtils'

const mockTeams = [
    {
        id: '1',
        name: 'Avito Design',
        description: 'Команда дизайнеров Avito',
        usersCount: 3,
        boardsCount: 2,
    },
]

const mockTeamDetails = {
    id: '1',
    name: 'Avito Design',
    description: 'Команда дизайнеров Avito',
    users: [
        {
            id: 'u1',
            fullName: 'Александр Ветров',
            email: 'vetrov@avito.ru',
            description: 'UI/UX Designer',
            avatarURL: 'https://example.com/avatar.png',
        },
    ],
    boards: [
        {
            id: 'b1',
            name: 'Доска 1',
            description: 'Первая доска команды',
        },
    ],
}

const server = setupServer(
    rest.get('/api/v1/teams', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ data: mockTeams }))
    }),

    rest.get('/api/v1/teams/1', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ data: mockTeamDetails }))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useTeams', () => {
    it('возвращает список команд', async () => {
        const wrapper = createWrapper()

        const { result } = renderHook(() => useTeams(), { wrapper })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data?.[0].name).toBe('Avito Design')
    })
})

describe('useTeam', () => {
    it('возвращает детали команды по ID', async () => {
        const wrapper = createWrapper()

        const { result } = renderHook(() => useTeam('1'), { wrapper })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data?.users?.[0].fullName).toBe('Александр Ветров')
        expect(result.current.data?.boards?.[0].name).toBe('Доска 1')
    })
})
