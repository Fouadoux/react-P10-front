import type { Task } from '@/lib/api/types'

/**
 * Keeps the tasks whose title or description contains the searched text.
 * The search ignores upper/lower case ("QUIZ" finds "Système de quiz").
 *
 * @param tasks the tasks to search in
 * @param query the text typed in the search box (an empty text means "no filter")
 * @returns     the matching tasks, in the same order
 */
export const filterTasksByQuery = (tasks: Task[], query: string): Task[] => {
    if (!query) return tasks
    const text = clean(query)
    return tasks.filter((task) =>
        clean(task.title).includes(text) ||
        clean(task.description ?? '').includes(text)
    )
}

const clean = (text: string): string =>
    text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
