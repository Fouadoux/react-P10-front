'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { authFetch } from '@/lib/api/client'
import type { CreateProjectData } from '@/types'

export type CreateProjectState = {
    message: string | null
    // true once the project is created: the form uses it to close the modal
    success: boolean
}

// Server Action: runs on the server when the "Créer un projet" form is submitted
export const createProjectAction = async (_previousState: CreateProjectState, formData: FormData): Promise<CreateProjectState> => {
    const name = String(formData.get('name') ?? '')
    const description = String(formData.get('description') ?? '')
    const contributors = String(formData.get('contributors') ?? '').split(',')
        .map(email => email.trim())
        .filter(email => email !== '');

    const response = await authFetch<CreateProjectData>('/projects', {
        method: 'POST',
        body: JSON.stringify({ name, description, contributors }),
    })
    if (!response.success) {
        if (response.data) {
            return { message: response.data.errors.map(e => e.message).join(', '), success: false }
        }
        return { message: response.message, success: false }
    }
    revalidatePath('/projects')
    return { message: null, success: true }
}

export const updateProjectAction = async (_previousState: CreateProjectState, formData: FormData): Promise<CreateProjectState> => {
    const name = String(formData.get('name') ?? '')
    const description = String(formData.get('description') ?? '')
    const projectId = String(formData.get('projectId') ?? '')

    const response = await authFetch<CreateProjectData>(`/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify({ name, description }),
    })
    if (!response.success) {
        if (response.data) {
            return { message: response.data.errors.map(e => e.message).join(', '), success: false }
        }
        return { message: response.message, success: false }
    }
    revalidatePath(`/projects/${projectId}`)
    revalidatePath('/projects')
    return { message: null, success: true }
}

export const addContributorAction = async (_previousState: CreateProjectState, formData: FormData): Promise<CreateProjectState> => {
    const email = String(formData.get('email') ?? '').trim()
    const projectId = String(formData.get('projectId') ?? '')

    const response = await authFetch<null>(`/projects/${projectId}/contributors`, {
        method: 'POST',
        body: JSON.stringify({ email }),
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

export const removeContributorAction = async (_previousState: CreateProjectState, formData: FormData): Promise<CreateProjectState> => {
    const userId = String(formData.get('userId') ?? '')
    const projectId = String(formData.get('projectId') ?? '')

    const response = await authFetch<null>(`/projects/${projectId}/contributors/${userId}`, {
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

// Server Action: runs when the deletion of a project is confirmed
export const deleteProjectAction = async (_previousState: CreateProjectState, formData: FormData): Promise<CreateProjectState> => {
    const projectId = String(formData.get('projectId') ?? '')

    const response = await authFetch<CreateProjectData>(`/projects/${projectId}`,
        {
            method: 'DELETE',
        })

    if (!response.success) {
        if (response.data) {
            return { message: response.data.errors.map(e => e.message).join(', '), success: false }
        }
        return { message: response.message, success: false }
    }

    revalidatePath(`/projects`)
    redirect(`/projects`)
}
