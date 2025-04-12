import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { useTasksByBoard, useUpdateTaskStatus } from '../api/tasks'
import { Task, Status } from '../types'
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from '@hello-pangea/dnd'
import { useTaskModal } from '../contexts/TaskModalContext'
import { useBoards } from '../api/boards'

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
            setColumns((prev) => ({
                ...prev,
                [sourceCol]: sourceTasks,
            }))
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

    if (!id) return <div>Не указан ID доски</div>
    if (isLoading) return <div>Загрузка задач...</div>
    if (error) return <div>Ошибка загрузки задач</div>

    return (
        <div style={{ padding: '1rem' }}>
            <h2>{board ? `Доска проекта: ${board.name}` : `Доска проекта #${id}`}</h2>
            <DragDropContext onDragEnd={onDragEnd}>
                <div style={{ display: 'flex', gap: 20 }}>
                    {statuses.map((status) => (
                        <Droppable key={status} droppableId={status}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    style={{
                                        flex: 1,
                                        border: '1px solid #ccc',
                                        borderRadius: 4,
                                        padding: '0.5rem',
                                        minHeight: 300,
                                        background: snapshot.isDraggingOver ? '#e0f7fa' : '#f5f5f5',
                                        transition: 'background 0.2s ease',
                                    }}
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
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    onClick={() => openModal(task)}
                                                    style={{
                                                        padding: '0.5rem',
                                                        marginBottom: '0.5rem',
                                                        border: '1px solid #000',
                                                        borderRadius: 4,
                                                        background: snapshot.isDragging
                                                            ? '#ede7f6'
                                                            : '#fff',
                                                        boxShadow: snapshot.isDragging
                                                            ? '0 2px 8px rgba(0,0,0,0.25)'
                                                            : '0 2px 4px rgba(0,0,0,0.1)',
                                                        transition: 'background 0.2s ease',
                                                        cursor: 'pointer',
                                                        ...provided.draggableProps.style,
                                                    }}
                                                >
                                                    <strong>{task.title}</strong>
                                                    <div
                                                        style={{
                                                            fontSize: '0.85rem',
                                                            color: '#666',
                                                        }}
                                                    >
                                                        {task.description}
                                                    </div>
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
