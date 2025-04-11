// src/pages/IssuesPage.tsx
import { useState, useEffect } from 'react'
import { useTasks } from '../api/tasks'
import { Task, Status } from '../types'
import './IssuesPage.css'
import { useTaskModal } from '../contexts/TaskModalContext'

const statuses: Status[] = ['todo', 'in-progress', 'done']
const statusLabels: Record<Status, string> = {
    todo: 'To do',
    'in-progress': 'In progress',
    done: 'Done',
}

const IssuesPage = () => {
    const { data: tasks = [], isLoading, error } = useTasks()
    const { openModal } = useTaskModal()

    const [columns, setColumns] = useState<Record<Status, Task[]>>({
        todo: [],
        'in-progress': [],
        done: [],
    })

    const [search, setSearch] = useState('')

    useEffect(() => {
        if (!tasks.length) return

        const filtered = tasks.filter(task =>
            task.title.toLowerCase().includes(search.toLowerCase())
        )

        const normalized = filtered.map(task => ({
            ...task,
            status: task.status
                .toLowerCase()
                .replace('backlog', 'todo')
                .replace('inprogress', 'in-progress') as Status,
        }))

        const grouped: Record<Status, Task[]> = {
            todo: [],
            'in-progress': [],
            done: [],
        }

        for (const task of normalized) {
            grouped[task.status].push(task)
        }

        setColumns(grouped)
    }, [tasks, search])

    if (isLoading) return <div className="page-wrapper">Загрузка задач...</div>
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

                <button className="issues-create-button" onClick={() => openModal()}>
                    Создать задачу
                </button>
            </div>

            <div className="board-columns">
                {statuses.map(status => (
                    <div key={status} className="board-column">
                        <h3 className="board-column-title">{statusLabels[status]}</h3>

                        {columns[status].map((task) => (
                            <div
                                key={task.id}
                                className="task-card"
                                onClick={() => openModal(task)}
                            >
                                <strong>{task.title}</strong>
                                <div className="task-description">{task.description}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default IssuesPage
