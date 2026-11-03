import type { TaskStatus } from '@/types'

/**
 * Keeps the tasks whose title or description contains the searched text.
 * The search ignores upper/lower case ("QUIZ" finds "Système de quiz").
 * Works on any kind of task that has a title and a description (dashboard tasks, project tasks...).
 *
 * @param tasks the tasks to search in
 * @param query the text typed in the search box (an empty text means "no filter")
 * @returns     the matching tasks, in the same order
 */
export const filterTasksByQuery = <T extends { title: string; description: string | null }>(tasks: T[], query: string): T[] => {
    if (!query) return tasks
    const text = clean(query)
    return tasks.filter((task) =>
        clean(task.title).includes(text) ||
        clean(task.description ?? '').includes(text)
    )
}

const clean = (text: string): string =>
    text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

// What the status dropdown can select: one status, or 'ALL' for "no filter"
export type StatusFilter = TaskStatus | 'ALL'

/**
 * Keeps only the tasks that have the selected status.
 *
 * @param tasks  the tasks to filter
 * @param status the status chosen in the dropdown, or 'ALL' to keep every task
 * @returns      the matching tasks, in the same order
 */
export const filterTasksByStatus = <T extends { status: TaskStatus }>(tasks: T[], status: StatusFilter): T[] => {
    if (status === 'ALL') return tasks
    return tasks.filter(task => task.status === status)
}
