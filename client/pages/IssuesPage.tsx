// client/pages/IssuesPage.tsx

import { useState, useEffect } from 'react'
import { Task } from '../types'
import './IssuesPage.css'
import { useTaskModal } from '../contexts/TaskModalContext'
import { useBoards } from '../api/boards'
import { useTasks, useTasksByBoard } from '../api/tasks'

const IssuesPage = () => {
    const { openModal } = useTaskModal()
    const { data: boards = [] } = useBoards()

    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [boardFilter, setBoardFilter] = useState('')
    const [assigneeFilter, setAssigneeFilter] = useState('')

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
            updated = updated.filter(task =>
                task.title.toLowerCase().includes(search.toLowerCase()) ||
                task.description.toLowerCase().includes(search.toLowerCase())
            )
        }

        if (statusFilter) {
            updated = updated.filter(task => task.status === statusFilter)
        }

        if (assigneeFilter) {
            updated = updated.filter(task =>
                task.assignee?.fullName?.toLowerCase().includes(assigneeFilter.toLowerCase())
            )
        }

        setFilteredTasks(updated)
    }, [tasks, search, statusFilter, assigneeFilter])

    if (isLoading || isLoadingBoard) return <div className="page-wrapper">Загрузка задач...</div>
    if (error) return <div className="page-wrapper">Ошибка загрузки задач</div>

    return (
        <div className="page-wrapper">
            <h2 className="issues-title">Все задачи</h2>

            <div className="issues-controls">
                <input
                    className="issues-search"
                    type="text"
                    placeholder="Поиск по названию или описанию"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <input
                    className="issues-search"
                    type="text"
                    placeholder="Поиск по исполнителю"
                    value={assigneeFilter}
                    onChange={(e) => setAssigneeFilter(e.target.value)}
                />

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

            <div className="tasks-list">
                {filteredTasks.map(task => (
                    <div
                        key={task.id}
                        className="task-card"
                        onClick={() => openModal(task)}
                    >
                        <div className="task-title">{task.title}</div>
                        <div className="task-meta">Приоритет: {task.priority}</div>
                        <div className="task-meta">Статус: {task.status}</div>
                        <div className="task-meta">Исполнитель: {task.assignee?.fullName || '—'}</div>
                        <div className="task-meta">Проект: {task.boardName || '—'}</div>
                        <div className="task-description">{task.description}</div>
                    </div>
                ))}
            </div>

            <footer className="issues-footer">
                <button className="create-task-bottom-button" onClick={() => openModal()}>
                    Создать задачу
                </button>
            </footer>
        </div>
    )
}

export default IssuesPage
