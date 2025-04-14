export const formatStatus = (status: string): string => {
    const map: Record<string, string> = {
        todo: 'To do',
        'in-progress': 'In progress',
        done: 'Done',
    }

    return map[status.toLowerCase()] || status
}
