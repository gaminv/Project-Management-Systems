export interface UpdateStatusVars {
    taskId: string
    status: string
    order?: number
}

export interface CreateTaskRequest {
    Title: string
    Description: string
    Priority: 'Low' | 'Medium' | 'High'
    AssigneeID: number
    BoardID: number
}

export interface UpdateTaskData {
    title: string
    description: string
    priority: 'Low' | 'Medium' | 'High'
    status: 'Backlog' | 'InProgress' | 'Done'
    assigneeId: number
    boardId: number
}

export interface UserTask {
    id: string
    title: string
    description: string
    status: string
    priority: string
    boardName: string
}
