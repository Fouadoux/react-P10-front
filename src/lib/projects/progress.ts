import type { TaskStatus } from '@/types'

// Progress of a project: how many of its tasks are done (percent is rounded, 0 when there is no task)
export const getProjectProgress = (tasks: { status: TaskStatus }[]): { done: number; total: number; percent: number } => {
    const done= tasks.filter(task=>task.status === 'DONE').length;
    const total = tasks.length;
    return {done, total,percent: total=== 0 ? 0 : Math.round((done*100)/total)}
}

