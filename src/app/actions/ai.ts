'use server'

import { createTaskAction } from '@/app/actions/tasks'
import { askLlm, parseJsonContent } from '@/lib/ai/llm'
import { buildUserMessage, SYSTEM_PROMPT } from '@/lib/ai/prompt'
import { parseDraftTasks, parseGeneratedTasks, type DraftTask } from '@/lib/ai/schema'
import { isBlank } from '@/lib/forms/isBlank'
import { getProject, getProjectTasks } from '@/lib/projects/api'

// What the user may type: longer texts cost tokens for nothing
const MAX_REQUEST_LENGTH = 4000

export type GenerateTasksState = {
    message: string | null
    // Short sentence from the AI for the cases without tasks (vague or off-topic request...)
    notice: string | null
    // The tasks to add to the review list; null when the generation failed (the current list is kept)
    tasks: DraftTask[] | null
}

const generationFailure = (message: string): GenerateTasksState => ({ message, notice: null, tasks: null })

// Server Action: asks the AI for tasks from the text typed in the project's "IA" modal
export const generateTasksAction = async (_previousState: GenerateTasksState, formData: FormData): Promise<GenerateTasksState> => {
    const projectId = String(formData.get('projectId') ?? '')
    const request = String(formData.get('prompt') ?? '').trim()

    // Cheap checks first: no call to the AI (nor to the backend) for a text that cannot work
    if (isBlank(request)) return generationFailure('Décrivez les tâches que vous souhaitez ajouter.')
    if (request.length > MAX_REQUEST_LENGTH) {
        return generationFailure(`Votre description est trop longue (${MAX_REQUEST_LENGTH} caractères maximum).`)
    }

    // The backend only returns a project to its members: this is also the access check
    const project = await getProject(projectId)
    if (!project) return generationFailure("Ce projet est introuvable ou vous n'y avez pas accès.")
    const existingTasks = await getProjectTasks(projectId)

    // Date of the server (Paris time): the model needs it to compute "next Friday", "end of month"...
    const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' })
    const answer = await askLlm(SYSTEM_PROMPT, buildUserMessage({
        projectName: project.name,
        projectDescription: project.description,
        today,
        existingTitles: existingTasks.map(task => task.title),
        request,
    }))
    if (!answer.ok) return generationFailure(answer.message)

    const parsedAnswer = parseJsonContent(answer.content)
    const generation = parseGeneratedTasks(parsedAnswer, today)
    if (!generation) return generationFailure("L'IA n'a pas renvoyé de réponse exploitable, réessayez.")

    return {
        message: null,
        notice: generation.notice === '' ? null : generation.notice,
        tasks: generation.tasks.map(task => ({ ...task, id: crypto.randomUUID() })),
    }
}

export type AddTasksState = {
    message: string | null
    success: boolean
    // Ids of the review-list tasks that were created: the list removes them (a retry must not create them twice)
    createdIds: string[]
}

// Server Action: creates in the project the tasks of the review list, one by one
export const addGeneratedTasksAction = async (_previousState: AddTasksState, formData: FormData): Promise<AddTasksState> => {
    const projectId = String(formData.get('projectId') ?? '')

    let rawTasks: unknown
    try {
        rawTasks = JSON.parse(String(formData.get('tasks') ?? ''))
    } catch {
        return { message: 'Les tâches sont illisibles, réessayez.', success: false, createdIds: [] }
    }
    // The browser can send anything: every task is checked again (title, description and due date are required)
    const tasks = parseDraftTasks(rawTasks)
    if (!tasks) {
        return { message: 'Chaque tâche doit avoir un titre, une description et une échéance.', success: false, createdIds: [] }
    }

    const createdIds: string[] = []
    let firstError: string | null = null
    for (const task of tasks) {
        // Same route as the "Créer une tâche" form: the backend contract stays in one place (createTaskAction)
        const taskData = new FormData()
        taskData.set('projectId', projectId)
        taskData.set('title', task.title)
        taskData.set('description', task.description)
        taskData.set('dueDate', task.dueDate)
        taskData.set('status', task.status)
        const result = await createTaskAction({ message: null, success: false }, taskData)
        if (result.success) createdIds.push(task.id)
        else firstError ??= result.message
    }

    const failedCount = tasks.length - createdIds.length
    if (failedCount > 0) {
        return {
            message: `${failedCount} tâche(s) n'ont pas pu être ajoutées${firstError ? ` : ${firstError}` : ''}. Les autres sont bien dans le projet.`,
            success: false,
            createdIds,
        }
    }
    return { message: null, success: true, createdIds }
}
