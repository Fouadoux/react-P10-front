'use server'

import { revalidatePath } from 'next/cache'
import { authFetch } from '@/lib/api/client'
import type { CreateTaskData } from '@/types'

// State shared by the task forms (create, edit, delete)
export type TaskFormState = {
    message: string | null
    // true once the action worked: the form uses it to close the modal
    success: boolean
}

// Server Action: runs on the server when the "Créer une tâche" form is submitted
export const createTaskAction = async (_previousState: TaskFormState, formData: FormData): Promise<TaskFormState> => {
    const title = String(formData.get('title') ?? '')
    const description = String(formData.get('description') ?? '')
    const dueDate = String(formData.get('dueDate') ?? '')
    const assigneeIds = formData.getAll('assigneeIds').map(String)
    const projectId = String(formData.get('projectId') ?? '')
    const status = String(formData.get('status') ?? 'TODO')

    const response = await authFetch<CreateTaskData>(`/projects/${projectId}/tasks`, {
        method: 'POST',
        body: JSON.stringify({ title, description, dueDate, assigneeIds }),
    })
    if (!response.success) {
        if (response.data) {
            return { message: response.data.errors.map(e => e.message).join(', '), success: false }
        }
        return { message: response.message, success: false }
    }

    if (status !== 'TODO') {
        await authFetch(`/projects/${projectId}/tasks/${response.data.task.id}`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        })
    }

    revalidatePath(`/projects/${projectId}`)
    return { message: null, success: true }
}

// Server Action: runs when the "Modifier" form of a task is submitted
export const updateTaskAction = async (_previousState: TaskFormState, formData: FormData): Promise<TaskFormState> => {
    const title = String(formData.get('title') ?? '')
    const description = String(formData.get('description') ?? '')
    const dueDate = String(formData.get('dueDate') ?? '')
    const assigneeIds = formData.getAll('assigneeIds').map(String)
    const projectId = String(formData.get('projectId') ?? '')
    const taskId= String(formData.get('taskId') ?? '')
    const status= String(formData.get('status') ?? '')

    const response = await authFetch<TaskFormState>(`/projects/${projectId}/tasks/${taskId}`,
    {
        method: 'PUT',
        body: JSON.stringify({ title, description, dueDate, assigneeIds, status })
    })

    if (!response.success) {
        if (response.data) {
            return { message: response.data.errors.map(e => e.message).join(', '), success: false }
        }
        return { message: response.message, success: false }
    }

    revalidatePath(`/projects/${projectId}`)
    return { message: null, success: true }
}

// Server Action: runs when the deletion of a task is confirmed
export const deleteTaskAction = async (_previousState: TaskFormState, formData: FormData): Promise<TaskFormState> => {
    const projectId = String(formData.get('projectId') ?? '')
    const taskId= String(formData.get('taskId') ?? '')
    const response = await authFetch<TaskFormState>(`/projects/${projectId}/tasks/${taskId}`,
        {
            method: 'DELETE',
        })

    if (!response.success) {
        if (response.data) {
            return { message: response.data.errors.map(e => e.message).join(', '), success: false }
        }
        return { message: response.message, success: false }
    }

    revalidatePath(`/projects/${projectId}`)
    return { message: null, success: true }
}
