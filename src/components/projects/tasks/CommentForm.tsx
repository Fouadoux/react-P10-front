'use client'

import { useActionState, useState } from 'react'
import { createCommentAction } from '@/app/actions/comments'
import type { TaskFormState } from '@/app/actions/tasks'

const initialState: TaskFormState = { message: null, success: false }

type CommentFormProps = {
    projectId: string
    taskId: string
}

// Field and "Envoyer" button at the bottom of the comments of a task
const CommentForm = ({ projectId, taskId }: CommentFormProps) => {
    const [content, setContent] = useState<string>('')

    // Empty the field once the comment is published (kept after a failure, so nothing typed is lost)
    const createAndClear = async (previousState: TaskFormState, formData: FormData): Promise<TaskFormState> => {
        const result = await createCommentAction(previousState, formData)
        if (result.success) setContent('')
        return result
    }
    const [state, formAction, isPending] = useActionState(createAndClear, initialState)

    return (
        <form action={formAction} className="flex flex-col gap-2">
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="taskId" value={taskId} />
            <div className="flex items-center gap-3">
                <label className="flex-1">
                    <span className="sr-only">Ajouter un commentaire</span>
                    <input
                        name="content"
                        type="text"
                        value={content}
                        onChange={event => setContent(event.target.value)}
                        placeholder="Ajouter un commentaire…"
                        autoComplete="off"
                        className="h-[44px] w-full rounded-[4px] border border-neutral-grey-200 bg-neutral-white px-4 text-sm focus:border-brand-dark-orange focus:outline-none focus:ring-1 focus:ring-brand-dark-orange"
                    />
                </label>
                <button
                    type="submit"
                    disabled={isPending}
                    className="h-[44px] cursor-pointer rounded-[10px] bg-neutral-grey-800 px-6 text-sm text-neutral-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Envoyer
                </button>
            </div>
            {state.message && <p role="alert" className="text-xs text-red-500">{state.message}</p>}
        </form>
    )
}

export default CommentForm
