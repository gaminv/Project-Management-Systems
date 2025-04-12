import { createContext, useContext, useEffect, useState } from 'react'
import { Task } from '../types'

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

    const openModal = (task?: Task) => {
        setSelectedTask(task)
        setIsOpen(true)
    }

    const closeTaskModal = () => {
        setIsOpen(false)
        setSelectedTask(undefined)
    }

    const onSubmit = async (updatedTask: Task) => {
        console.log('Submit task:', updatedTask)
        closeTaskModal()
    }

    // 🧠 Добавляем слушатель кастомного события
    useEffect(() => {
        const handleOpenModal = () => openModal()
        window.addEventListener('openTaskModal', handleOpenModal)
        return () => window.removeEventListener('openTaskModal', handleOpenModal)
    }, [])

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
