import { useEffect, useState } from 'react'
import { Task, User, Board } from '../../types/types'
import './TaskModal.scss'
import { useUsers } from '../../api/users'
import { useBoards } from '../../api/boards'
import { useNavigate, useLocation } from 'react-router-dom'

interface Props {
    task?: Task
    onClose: () => void
    onSubmit: (task: Task) => void
}

const normalizePriorityFromBackend = (priority: string): 'low' | 'medium' | 'high' => {
    const map: Record<string, 'low' | 'medium' | 'high'> = {
        low: 'low',
        medium: 'medium',
        high: 'high',
    }
    return map[priority.toLowerCase()] || 'medium'
}

const normalizeStatusFromBackend = (status: string): 'todo' | 'in-progress' | 'done' => {
    const map: Record<string, 'todo' | 'in-progress' | 'done'> = {
        backlog: 'todo',
        inprogress: 'in-progress',
        'in-progress': 'in-progress',
        InProgress: 'in-progress',
        done: 'done',
        Done: 'done',
        todo: 'todo',
        ToDo: 'todo',
        Backlog: 'todo',
    }
    return map[status.toLowerCase()] || 'todo'
}

const DRAFT_KEY = 'taskDraft'

const TaskModal = ({ task, onClose, onSubmit }: Props) => {
    const [form, setForm] = useState<Task>({
        id: '',
        title: '',
        description: '',
        priority: 'low',
        status: 'todo',
        assigneeId: '',
        boardId: '',
    })

    const [errors, setErrors] = useState({
        title: '',
        description: '',
        assigneeId: '',
        boardId: '',
    })

    const { data: users = [] } = useUsers()
    const { data: boards = [] } = useBoards()
    const navigate = useNavigate()
    const location = useLocation()

    const isOnBoardPage = location.pathname.startsWith('/boards/')
    const isEditingFromBoard = !!task && isOnBoardPage

    useEffect(() => {
        if (task) {
            const normalizedStatus = normalizeStatusFromBackend(task.status)
            const normalizedPriority = normalizePriorityFromBackend(task.priority)

            const matchedBoard = boards.find((b) => b.name === task.boardName)

            setForm({
                id: task.id,
                title: task.title,
                description: task.description,
                priority: normalizedPriority,
                status: normalizedStatus,
                assigneeId: String(task.assignee?.id ?? ''),
                boardId: matchedBoard ? String(matchedBoard.id) : String(task.boardId ?? ''),
            })
        } else {
            const draft = localStorage.getItem(DRAFT_KEY)
            if (draft) {
                try {
                    const parsed = JSON.parse(draft)
                    setForm(parsed)
                } catch (e) {
                    console.warn('Ошибка парсинга черновика:', e)
                }
            }
        }
    }, [task, boards])

    useEffect(() => {
        if (!task) {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
        }
    }, [form, task])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    const handleSubmit = () => {
        const newErrors = {
            title: form.title.trim() ? '' : 'Название обязательно',
            description: form.description.trim() ? '' : 'Описание обязательно',
            assigneeId: form.assigneeId ? '' : 'Выберите исполнителя',
            boardId: form.boardId ? '' : 'Выберите доску',
        }

        setErrors(newErrors)
        const hasError = Object.values(newErrors).some((err) => err)
        if (hasError) return

        localStorage.removeItem(DRAFT_KEY)
        onSubmit(form)
    }

    const handleGoToBoard = () => {
        if (!task) return

        let boardId = task.boardId

        if (!boardId && task.boardName && boards.length > 0) {
            const matched = boards.find(b => b.name === task.boardName)
            if (matched) boardId = matched.id
        }

        if (!boardId) {
            console.warn('❌ Не удалось найти boardId для перехода к доске')
            return
        }

        navigate(`/boards/${boardId}?taskId=${task.id}`)
        onClose()
    }

    return (
        <div className="task-modal">
            <h3>{task ? 'Редактировать' : 'Создать'} задачу</h3>

            <input
                name="title"
                placeholder="Название задачи"
                value={form.title}
                onChange={handleChange}
                className={errors.title ? 'input-error' : ''}
            />
            {errors.title && <div className="error-text">{errors.title}</div>}

            <textarea
                name="description"
                placeholder="Описание"
                value={form.description}
                onChange={handleChange}
                className={errors.description ? 'input-error' : ''}
            />
            {errors.description && <div className="error-text">{errors.description}</div>}

            <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="low">Низкий приоритет</option>
                <option value="medium">Средний приоритет</option>
                <option value="high">Высокий приоритет</option>
            </select>

            <select name="status" value={form.status} onChange={handleChange}>
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
            </select>

            <select
                name="assigneeId"
                value={form.assigneeId}
                onChange={handleChange}
                className={errors.assigneeId ? 'input-error' : ''}
            >
                <option value="" disabled hidden>
                    Выберите исполнителя
                </option>
                {users.map((user: User) => (
                    <option key={user.id} value={user.id}>
                        {user.fullName}
                    </option>
                ))}
            </select>
            {errors.assigneeId && <div className="error-text">{errors.assigneeId}</div>}

            <select
                name="boardId"
                value={form.boardId}
                onChange={handleChange}
                className={errors.boardId ? 'input-error' : ''}
                disabled={isEditingFromBoard}
            >
                <option value="" disabled hidden>
                    Выберите доску
                </option>
                {boards.map((board: Board) => (
                    <option key={board.id} value={String(board.id)}>
                        {board.name}
                    </option>
                ))}
            </select>
            {errors.boardId && <div className="error-text">{errors.boardId}</div>}

            <div className="task-modal-actions">
                <button onClick={handleSubmit}>{task ? 'Обновить' : 'Создать'}</button>
                <button onClick={onClose} className="cancel-button">
                    Отмена
                </button>
            </div>

            {task && !isOnBoardPage && (
                <button className="go-to-board" onClick={handleGoToBoard}>
                    Перейти к доске
                </button>
            )}
        </div>
    )
}

export default TaskModal
