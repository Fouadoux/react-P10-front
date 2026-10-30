import type { Task, TaskStatus } from '@/lib/api/types'

// The three Kanban columns: one list of tasks per status (cancelled tasks have no column)
export type KanbanColumns = Record<Exclude<TaskStatus, 'CANCELLED'>, Task[]>

/**
 * Keeps only the tasks due during the same month (and year) as `today`.
 * Tasks without a due date are left out.
 *
 * @param tasks the tasks received from the backend
 * @param today the current date (passed in, not read here, so the function stays predictable)
 * @returns     the tasks of the month, in the same order
 */
export const getTasksOfMonth = (tasks: Task[], today: Date): Task[] => {
    return tasks.filter(task => {
        if (!task.dueDate) return false
        const date = new Date(task.dueDate)
        return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()

    })
}

/**
 * Splits tasks into the three Kanban columns according to their status.
 *
 * @param tasks the tasks to split
 * @returns     one list per column, each keeping the order it had in `tasks`
 */
export const groupTasksByStatus = (tasks: Task[]): KanbanColumns => {
    return {
        TODO: tasks.filter(task =>
            task.status === 'TODO'
        ),
        IN_PROGRESS: tasks.filter(task =>
            task.status === 'IN_PROGRESS'
        ),
        DONE: tasks.filter(task =>
            task.status === 'DONE'
        )
    }
}
