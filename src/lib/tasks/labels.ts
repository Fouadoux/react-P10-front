import type { TaskStatus } from '@/types'

// French text shown in the status badge of each card (key = status sent by the backend)
export const STATUS_LABELS: Record<TaskStatus, string> = {
    TODO: 'À faire',
    IN_PROGRESS: 'En cours',
    DONE: 'Terminée',
    CANCELLED: 'Annulée',
}

// One look per status, taken from the mockup colors
export const STATUS_CLASSES: Record<TaskStatus, string> = {
    TODO: 'bg-red-50 text-red-500',
    IN_PROGRESS: 'bg-amber-50 text-amber-500',
    DONE: 'bg-green-50 text-green-600',
    CANCELLED: 'bg-neutral-grey-50 text-neutral-grey-800',
}

/**
 * Formats a task due date for the card (e.g. "2026-03-09T00:00:00.000Z" -> "9 mars").
 *
 * @param dueDate the ISO date sent by the back, or null when the task has no due date
 * @returns       the text shown next to the calendar
 */
export const formatDueDate = (dueDate: string | null): string => {
    if (!dueDate) return 'Inconnue'
    return new Date(dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

// The date shown on a comment, with the year: "5 novembre 2026"
export const formatCommentDate = (createdAt: string): string =>
    new Date(createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
