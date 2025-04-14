export type Status = 'todo' | 'in-progress' | 'done'
export type Priority = 'low' | 'medium' | 'high'

export interface User {
    id: string;
    fullName: string
    email: string
    avatarUrl?: string
}

export interface Task {
    id: string
    title: string
    description: string
    status: Status
    priority: Priority
    assigneeId: string
    assignee?: {
        id: string
        fullName: string
        email?: string
    }
    boardId?: string 
    boardName?: string 
}

export interface Board {
    id: string;
    name: string;
}
