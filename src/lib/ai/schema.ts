import { isBlank } from '@/lib/forms/isBlank'
import type { TaskStatus } from '@/types'

// The statuses the AI may give to a task (a cancelled task makes no sense for a new one)
export type GeneratedTaskStatus = Extract<TaskStatus, 'TODO' | 'IN_PROGRESS' | 'DONE'>

// A task as proposed by the AI: the same fields as the "Créer une tâche" form (no assignees, no priority)
export type GeneratedTask = {
    title: string
    description: string
    // "2026-11-10" (format of the date input), or '' when the AI found no deadline: the user fills it in the review list
    dueDate: string
    status: GeneratedTaskStatus
}

// A task of the review list. The id only identifies it in the interface (React key, edit, delete)
export type DraftTask = GeneratedTask & { id: string }

export const MAX_TASKS = 8
export const MAX_TITLE_LENGTH = 80
export const MAX_DESCRIPTION_LENGTH = 280
export const MAX_NOTICE_LENGTH = 160

const STATUSES: GeneratedTaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

// JSON Schema sent to the AI provider (structured output). It is kept minimal on purpose: the length limits are written in
// the prompt and enforced by parseGeneratedTasks, because the keywords accepted in strict mode are not all documented.
export const GENERATED_TASKS_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    required: ['tasks', 'notice'],
    properties: {
        tasks: {
            type: 'array',
            items: {
                type: 'object',
                additionalProperties: false,
                required: ['title', 'description', 'dueDate', 'status'],
                properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    dueDate: { type: 'string' },
                    status: { type: 'string', enum: STATUSES },
                },
            },
        },
        notice: { type: 'string' },
    },
} as const

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value)

// The text if `value` is a string (trimmed, cut at `maxLength`), otherwise ''
const cleanText = (value: unknown, maxLength: number): string =>
    typeof value === 'string' ? value.trim().slice(0, maxLength) : ''

const isStatus = (value: unknown): value is GeneratedTaskStatus =>
    typeof value === 'string' && STATUSES.some(status => status === value)

const isValidDate = (value: string): boolean => DATE_PATTERN.test(value) && !Number.isNaN(Date.parse(value))

export type ParsedGeneration = {
    tasks: GeneratedTask[]
    notice: string
}

/**
 * Checks what the AI answered. A model can break its own schema (too long text, date in the past...),
 * so nothing it says is trusted: every field is checked and cleaned here.
 *
 * @param raw   the JSON the AI returned, already parsed (any shape)
 * @param today today's date as "YYYY-MM-DD": an earlier deadline is dropped
 * @returns     the cleaned tasks and notice, or null when the answer does not have the expected shape at all
 */
export const parseGeneratedTasks = (raw: unknown, today: string): ParsedGeneration | null => {
    if (!isRecord(raw) || !Array.isArray(raw.tasks)) return null

    const tasks: GeneratedTask[] = []
    for (const item of raw.tasks.slice(0, MAX_TASKS)) {
        if (!isRecord(item)) continue
        const title = cleanText(item.title, MAX_TITLE_LENGTH)
        if (isBlank(title)) continue
        const dueDate = cleanText(item.dueDate, 10)
        tasks.push({
            title,
            description: cleanText(item.description, MAX_DESCRIPTION_LENGTH),
            // ISO dates compare like text: a deadline before today (or an invalid one) becomes "no deadline"
            dueDate: isValidDate(dueDate) && dueDate >= today ? dueDate : '',
            status: isStatus(item.status) ? item.status : 'TODO',
        })
    }
    return { tasks, notice: cleanText(raw.notice, MAX_NOTICE_LENGTH) }
}

/**
 * Checks the tasks sent back by the review list before they are created in the project.
 * Stricter than parseGeneratedTasks: title, description and due date are all required, like in the task form.
 *
 * @param raw the parsed JSON sent by the browser (any shape: it comes from the user, not from the AI)
 * @returns   the tasks, or null if one of them is incomplete or malformed
 */
export const parseDraftTasks = (raw: unknown): DraftTask[] | null => {
    if (!Array.isArray(raw) || raw.length === 0 || raw.length > 50) return null

    const tasks: DraftTask[] = []
    for (const item of raw) {
        if (!isRecord(item) || typeof item.id !== 'string') return null
        const title = cleanText(item.title, 255)
        const description = cleanText(item.description, 2000)
        const dueDate = cleanText(item.dueDate, 10)
        if (isBlank(title) || isBlank(description) || !isValidDate(dueDate) || !isStatus(item.status)) return null
        tasks.push({ id: item.id, title, description, dueDate, status: item.status })
    }
    return tasks
}
