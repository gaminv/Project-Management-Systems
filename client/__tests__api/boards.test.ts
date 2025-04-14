import { renderHook } from '@testing-library/react'
import { waitFor } from '@testing-library/dom'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { useBoards } from '../api/boards'
import { createWrapper } from '../utils/testUtils'

const mockBoards = [
    { id: '1', name: 'Project Alpha' },
    { id: '2', name: 'Project Beta' },
]

const server = setupServer(
    rest.get('/api/v1/boards', (_req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ data: mockBoards }))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('useBoards', () => {
    it('возвращает список досок', async () => {
        const wrapper = createWrapper()
        const { result } = renderHook(() => useBoards(), { wrapper })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))

        expect(result.current.data).toEqual(mockBoards)
    })
})
