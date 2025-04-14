import { createContext, useContext, useState, useEffect } from 'react'
import { Task } from '../types/types'
import { useCreateTask, useUpdateTask, UpdateTaskData } from '../api/tasks'
import { useQueryClient } from '@tanstack/react-query'

interface TaskModalContextProps {
    isOpen: boolean
    selectedTask?: Task
    openModal: (task?: Task) => void
    closeTaskModal: () => void
    onSubmit: (task: Task) => void
}   

const TaskModalContext = createContext<TaskModalContextProps | undefined>(undefined)

export const TaskModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<Task | undefined>()

    const createTask = useCreateTask()
    const updateTask = useUpdateTask()
    const queryClient = useQueryClient()

    const openModal = (task?: Task) => {
        setSelectedTask(task)
        setIsOpen(true)
    }

    const closeTaskModal = () => {
        setIsOpen(false)
        setSelectedTask(undefined)
    }

    useEffect(() => {
        const handle = () => openModal()
        window.addEventListener('openTaskModal', handle)

        return () => {
            window.removeEventListener('openTaskModal', handle)
        }
    }, [])

    const onSubmit = (task: Task) => {
        const normalizedPriority: 'Low' | 'Medium' | 'High' =
            task.priority === 'low'
                ? 'Low'
                : task.priority === 'medium'
                    ? 'Medium'
                    : 'High'

        const normalizedStatus: 'Backlog' | 'InProgress' | 'Done' =
            task.status === 'todo'
                ? 'Backlog'
                : task.status === 'in-progress'
                    ? 'InProgress'
                    : 'Done'

        const payload: UpdateTaskData = {
            title: task.title,
            description: task.description,
            priority: normalizedPriority,
            status: normalizedStatus,
            assigneeId: Number(task.assigneeId), 
            boardId: Number(task.boardId),       
        }


        if (task.id) {
            console.log('Отправляю update с payload:', payload)
            updateTask.mutate(
                {
                    taskId: task.id,
                    data: payload,
                },
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ['tasks'] })
                        queryClient.invalidateQueries({ queryKey: ['tasks', task.boardId] })
                        closeTaskModal()
                    },
                    onError: (err) => {
                        console.error('Ошибка обновления задачи:', err)
                    },
                }
            )
        } else {
            // Создание задачи
            createTask.mutate(
                {
                    Title: task.title,
                    Description: task.description,
                    Priority: normalizedPriority,
                    AssigneeID: Number(task.assigneeId),
                    BoardID: Number(task.boardId),
                },
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: ['tasks'] })
                        queryClient.invalidateQueries({ queryKey: ['tasks', task.boardId] })
                        closeTaskModal()
                    },
                    onError: (err) => {
                        console.error('Ошибка создания задачи:', err)
                    },
                }
            )
        }
    }

    return (
        <TaskModalContext.Provider
            value={{ isOpen, selectedTask, openModal, closeTaskModal, onSubmit }}
        >
            {children}
        </TaskModalContext.Provider>
    )
}

export const useTaskModal = () => {
    const context = useContext(TaskModalContext)
    if (!context) throw new Error('useTaskModal must be used within a TaskModalProvider')
    return context
}
