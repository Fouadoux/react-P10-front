'use client'

import { useActionState, useEffect } from 'react'
import { deleteCommentAction } from '@/app/actions/comments'
import type { TaskFormState } from '@/app/actions/tasks'
import Button from '@/components/ui/Button'
import ModalDialog from '@/components/ui/ModalDialog'

const initialState: TaskFormState = { message: null, success: false }

type DeleteCommentFormProps = {
    projectId: string
    taskId: string
    commentId: string
    onClose: () => void
}

// The confirmation itself. It is a separate component so that its state starts fresh every time the modal opens.
const DeleteCommentForm = ({ projectId, taskId, commentId, onClose }: DeleteCommentFormProps) => {
    const [state, formAction, isPending] = useActionState(deleteCommentAction, initialState)

    useEffect(() => {
        if (state.success) onClose()
    }, [state.success, onClose])

    return (
        <form action={formAction} className="flex flex-col items-start gap-6">
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="taskId" value={taskId} />
            <input type="hidden" name="commentId" value={commentId} />
            <p className="text-base text-neutral-grey-950">Voulez-vous vraiment supprimer ce commentaire ? Cette action est définitive.</p>
            {state.message && <p role="alert" className="text-red-500">{state.message}</p>}
            <div className="flex flex-wrap gap-4">
                <Button label="Annuler" onClick={onClose} />
                <Button label="Supprimer" type="submit" disabled={isPending} />
            </div>
        </form>
    )
}

type DeleteCommentModalProps = {
    projectId: string
    taskId: string
    commentId: string
    isOpen: boolean
    onClose: () => void
}

// "Supprimer" confirmation modal of a comment
const DeleteCommentModal = ({ projectId, taskId, commentId, isOpen, onClose }: DeleteCommentModalProps) => (
    <ModalDialog isOpen={isOpen} onClose={onClose} title="Supprimer le commentaire">
        <DeleteCommentForm projectId={projectId} taskId={taskId} commentId={commentId} onClose={onClose} />
    </ModalDialog>
)

export default DeleteCommentModal
