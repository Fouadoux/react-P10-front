import type { TaskPriority, TaskStatus } from '@/types'

// Rank of each priority: the smaller the number, the more urgent
export const PRIORITY_RANK: Record<TaskPriority, number> = {
    LOW: 3,
    MEDIUM: 2,
    HIGH: 1,
    URGENT: 0,
}

// Rank of each status in the dashboard list: the smaller the number, the higher the task appears
export const STATUS_RANK: Record<TaskStatus, number> = {
    TODO: 0,
    IN_PROGRESS: 1,
    DONE: 2,
    CANCELLED: 3,
}

// A due date as a number, to compare dates. A task without due date gets the biggest number: it comes last.
const getDueTime = (dueDate: string | null): number => (dueDate ? new Date(dueDate).getTime() : Number.MAX_SAFE_INTEGER)

/**
 * Sorts tasks by status (to do, in progress, done, cancelled), then, inside each status, by due date:
 * the closest first, the tasks without due date last.
 * Returns a new array: the one received is left untouched.
 */
export const sortByStatusThenDueDate = <T extends { status: TaskStatus; dueDate: string | null }>(tasks: T[]): T[] => {
    // The date only counts when both tasks have the same status (the first difference is 0)
    return [...tasks].sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status] || getDueTime(a.dueDate) - getDueTime(b.dueDate))
}

/**
 * Sorts tasks from the most urgent priority to the least urgent one.
 * Works on any kind of task that has a priority (dashboard tasks, project tasks...).
 * Returns a new array: the one received is left untouched.
 */
export const sortByPriority = <T extends { priority: TaskPriority }>(tasks: T[]): T[] => {
    return [...tasks].sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority])
}
