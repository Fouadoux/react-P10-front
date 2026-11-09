'use server'
import { authFetch } from '@/lib/api/client';
import { revalidatePath } from 'next/cache';
import type { TaskFormState } from '@/app/actions/tasks';


export const createCommentAction = async (_previousState: TaskFormState, formData: FormData): Promise<TaskFormState> => {
    const projectId = String(formData.get('projectId') ?? '')
    const taskId = String(formData.get('taskId') ?? '')
    const content = String(formData.get('content') ?? '').trim()

    const response = await authFetch<null>(`/projects/${projectId}/tasks/${taskId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content }),
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
