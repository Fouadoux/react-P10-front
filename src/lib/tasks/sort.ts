import type { TaskPriority } from '@/types'

// Rank of each priority: the smaller the number, the more urgent
export const PRIORITY_RANK: Record<TaskPriority, number> = {
    LOW: 3,
    MEDIUM: 2,
    HIGH: 1,
    URGENT: 0,
}

/**
 * Sorts tasks from the most urgent priority to the least urgent one.
 * Works on any kind of task that has a priority (dashboard tasks, project tasks...).
 * Returns a new array: the one received is left untouched.
 */
export const sortByPriority = <T extends { priority: TaskPriority }>(tasks: T[]): T[] => {
    return [...tasks].sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority])
}
