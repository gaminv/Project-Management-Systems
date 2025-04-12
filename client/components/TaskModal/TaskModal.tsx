import { useEffect, useState } from 'react'
import { Task, User, Board } from '../../types'
import './TaskModal.css'
import { useUsers } from '../../api/users'
import { useBoards } from '../../api/boards'
import { useNavigate } from 'react-router-dom'
import { useUpdateTask } from '../../api/tasks'

interface Props {
    task?: Task
    onClose: () => void
    onSubmit?: (task: Task) => void
}

const TaskModal = ({ task, onClose, onSubmit }: Props) => {
    const [form, setForm] = useState<Task>(
        task || {
            id: '',
            title: '',
            description: '',
            priority: 'low',
            status: 'todo',
            assigneeId: '',
            projectId: '',
        }
    )

    const { data: users = [] } = useUsers()
    const { data: boards = [] } = useBoards()
    const navigate = useNavigate()
    const { mutate: updateTask } = useUpdateTask()

    useEffect(() => {
        if (task) setForm(task)
    }, [task])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = () => {
        if (form.title.trim() === '') return

        if (task) {
            updateTask({
                taskId: task.id,
                data: {
                    title: form.title,
                    description: form.description,
                    priority:
                        form.priority === 'low'
                            ? 'Low'
                            : form.priority === 'medium'
                                ? 'Medium'
                                : 'High',
                    status:
                        form.status === 'todo'
                            ? 'Backlog'
                            : form.status === 'in-progress'
                                ? 'InProgress'
                                : 'Done',
                    assigneeId: form.assigneeId,
                    boardId: form.projectId,
                },
            })
            onClose()
        } else {
            onSubmit?.(form)
        }
    }

    const handleGoToBoard = () => {
        if (form.projectId) {
            navigate(`/boards/${form.projectId}`)
            onClose()
        }
    }

    return (
        <div className="task-modal">
            <h3>{task ? 'Редактировать' : 'Создать'} задачу</h3>

            <input
                name="title"
                placeholder="Название задачи"
                value={form.title}
                onChange={handleChange}
            />

            <textarea
                name="description"
                placeholder="Описание"
                value={form.description}
                onChange={handleChange}
            />

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

            <select name="assigneeId" value={form.assigneeId} onChange={handleChange}>
                <option value="">Выберите исполнителя</option>
                {users.map((user: User) => (
                    <option key={user.id} value={user.id}>
                        {user.fullName}
                    </option>
                ))}
            </select>

            <select name="projectId" value={form.projectId} onChange={handleChange}>
                <option value="">Выберите доску</option>
                {boards.map((board: Board) => (
                    <option key={board.id} value={board.id}>
                        {board.name}
                    </option>
                ))}
            </select>

            <div className="task-modal-actions">
                <button onClick={handleSubmit}>{task ? 'Обновить' : 'Создать'}</button>
                <button onClick={onClose} className="cancel-button">Отмена</button>
            </div>

            {task && (
                <button className="go-to-board" onClick={handleGoToBoard}>
                    Перейти к доске
                </button>
            )}
        </div>
    )
}

export default TaskModal
