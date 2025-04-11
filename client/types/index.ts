export type Status = 'todo' | 'in-progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export interface User {
    id: string;
    name: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    projectId: string;
    status: Status;
    priority: Priority;
    assigneeId: string;
    order?: number;
}

export interface Board {
    id: string;
    name: string;
}
