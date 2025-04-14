import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useTasksByBoard, useUpdateTaskStatus } from '../api/tasks'
import { Task, Status } from '../types/types'
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from '@hello-pangea/dnd'
import { useTaskModal } from '../contexts/TaskModalContext'
import { useBoards } from '../api/boards'
import './BoardsPage.scss'

const statuses: Status[] = ['todo', 'in-progress', 'done']

const statusLabels: Record<Status, string> = {
    todo: 'To do',
    'in-progress': 'In progress',
    done: 'Done',
}

const BoardPage: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const { data: tasks, isLoading, error } = useTasksByBoard(id ?? '')
    const { openModal } = useTaskModal()
    const [searchParams] = useSearchParams()
    const { data: boards = [] } = useBoards()
    const updateTaskStatus = useUpdateTaskStatus()

    const board = boards.find((b) => String(b.id) === id)

    const [columns, setColumns] = useState<Record<Status, Task[]>>({
        todo: [],
        'in-progress': [],
        done: [],
    })

    useEffect(() => {
        if (tasks) {
            const normalized = tasks.map((task) => ({
                ...task,
                status: task.status
                    .toLowerCase()
                    .replace('inprogress', 'in-progress')
                    .replace('backlog', 'todo') as Status,
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

            const taskId = searchParams.get('taskId')
            if (taskId) {
                const found = normalized.find((t) => t.id === taskId)
                if (found) openModal(found)
            }
        }
    }, [tasks, searchParams, openModal])

    const onDragEnd = (result: DropResult) => {
        const { source, destination } = result
        if (!destination) return

        const sourceCol = source.droppableId as Status
        const destCol = destination.droppableId as Status

        const sourceTasks = Array.from(columns[sourceCol])
        const [moved] = sourceTasks.splice(source.index, 1)

        if (!moved) return

        if (sourceCol === destCol) {
            sourceTasks.splice(destination.index, 0, moved)
            setColumns((prev) => ({ ...prev, [sourceCol]: sourceTasks }))
        } else {
            const destTasks = Array.from(columns[destCol])
            moved.status = destCol
            destTasks.splice(destination.index, 0, moved)
            setColumns((prev) => ({
                ...prev,
                [sourceCol]: sourceTasks,
                [destCol]: destTasks,
            }))

            updateTaskStatus.mutate({
                taskId: moved.id,
                status: destCol,
                order: destination.index,
            })
        }
    }

    if (!id) return <div className="page-wrapper">Не указан ID доски</div>
    if (isLoading) return <div className="page-wrapper">Загрузка задач...</div>
    if (error) return <div className="page-wrapper">Ошибка загрузки задач</div>

    return (
        <div className="page-wrapper">
            <h2 className="issues-title">
                {board ? `Доска проекта: ${board.name}` : `Доска проекта #${id}`}
            </h2>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="board-columns">
                    {statuses.map((status) => (
                        <Droppable key={status} droppableId={status}>
                            {(provided, snapshot) => (
                                <div
                                    className={`board-column ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <h4>{statusLabels[status]}</h4>
                                    {columns[status].map((task, index) => (
                                        <Draggable
                                            key={task.id}
                                            draggableId={task.id.toString()}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    onClick={() => openModal(task)}
                                                    style={provided.draggableProps.style}
                                                >
                                                    <div className="task-title">{task.title}</div>
                                                    <div className="task-description">{task.description}</div>
                                                    <div className="task-meta">Приоритет: {task.priority}</div>
                                                    <div className="task-meta">Исполнитель: {task.assignee?.fullName || '—'}</div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    )
}

export default BoardPage
