import type { TaskStatus } from '@/lib/api/types'

// French text shown in the status badge of each card (key = status sent by the backend)
export const STATUS_LABELS: Record<TaskStatus, string> = {
    TODO: 'À faire',
    IN_PROGRESS: 'En cours',
    DONE: 'Terminée',
    CANCELLED: 'Annulée',
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
