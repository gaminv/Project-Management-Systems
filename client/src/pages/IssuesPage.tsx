import { useState, useEffect } from 'react'
import { Task } from '../types/types'
import './IssuesPage.scss'
import { useTaskModal } from '../contexts/TaskModalContext'
import { useBoards } from '../api/boards'
import { useTasks, useTasksByBoard } from '../api/tasks'
import { formatStatus } from '../utils/format' 

const IssuesPage = () => {
    const { openModal, isOpen, selectedTask } = useTaskModal()
    const { data: boards = [] } = useBoards()

    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [boardFilter, setBoardFilter] = useState('')
    const [activeTaskId, setActiveTaskId] = useState<string | null>(null)

    const { data: allTasks = [], isLoading, error } = useTasks()
    const { data: boardTasks = [], isLoading: isLoadingBoard } = useTasksByBoard(boardFilter)

    const tasks = boardFilter ? boardTasks : allTasks
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([])

    useEffect(() => {
        let updated = tasks.map(task => ({
            ...task,
            status: task.status
                .toLowerCase()
                .replace('backlog', 'todo')
                .replace('inprogress', 'in-progress') as Task['status'],
        }))

        if (search.trim()) {
            const term = search.toLowerCase()
            updated = updated.filter(task =>
                task.title.toLowerCase().includes(term) ||
                task.assignee?.fullName.toLowerCase().includes(term)
            )
        }

        if (statusFilter) {
            updated = updated.filter(task => task.status === statusFilter)
        }

        setFilteredTasks(updated)
    }, [tasks, search, statusFilter, boardFilter, isOpen])

    useEffect(() => {
        if (isOpen && selectedTask) {
            setActiveTaskId(selectedTask.id)
        } else {
            setActiveTaskId(null)
        }
    }, [isOpen, selectedTask])

    if (isLoading || isLoadingBoard) return <div className="page-wrapper">Загрузка задач...</div>
    if (error) return <div className="page-wrapper">Ошибка загрузки задач</div>

    return (
        <div className="page-wrapper">
            <h2 className="issues-title">Все задачи</h2>

            <div className="issues-controls">
                <input
                    className="issues-search"
                    type="text"
                    placeholder="Поиск по названию или исполнителю"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="filters-content">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Все статусы</option>
                        <option value="todo">To do</option>
                        <option value="in-progress">In progress</option>
                        <option value="done">Done</option>
                    </select>

                    <select
                        value={boardFilter}
                        onChange={(e) => setBoardFilter(e.target.value)}
                    >
                        <option value="">Все доски</option>
                        {boards.map(board => (
                            <option key={board.id} value={board.id}>
                                {board.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="tasks-list">
                {filteredTasks.map(task => (
                    <div
                        key={task.id}
                        className={`task-card ${task.id === activeTaskId ? 'active' : ''}`}
                        onClick={() => openModal(task)}
                    >
                        <div className="task-title">{task.title}</div>
                        <div className="task-meta">Приоритет: {task.priority}</div>
                        <div className="task-meta">Статус: {formatStatus(task.status)}</div>
                        <div className="task-meta">Исполнитель: {task.assignee?.fullName || '—'}</div>
                        <div className="task-meta">
                            Проект: {task.boardName || boards.find(b => b.id === task.boardId)?.name || '—'}
                        </div>
                        <div className="task-description">{task.description}</div>
                    </div>
                ))}
            </div>

            <button className="create-task-bottom-button" onClick={() => openModal()}>
                Создать задачу
            </button>
        </div>
    )
}

export default IssuesPage
