'use client'

import { useActionState, useEffect, useState } from 'react'
import { updateCommentAction } from '@/app/actions/comments'
import type { TaskFormState } from '@/app/actions/tasks'
import DeleteCommentModal from '@/components/projects/tasks/DeleteCommentModal'
import { isBlank } from '@/lib/forms/isBlank'
import { formatCommentDate } from '@/lib/tasks/labels'
import { getDisplayName } from '@/lib/users/displayName'
import { getInitials } from '@/lib/users/initials'
import type { ProjectTask } from '@/types'

const initialState: TaskFormState = { message: null, success: false }

const actionButtonClass = 'cursor-pointer text-xs text-neutral-grey-800 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange'

type CommentEditFormProps = {
    projectId: string
    taskId: string
    comment: ProjectTask['comments'][number]
    // Called when the comment is saved or when the user gives up
    onDone: () => void
}

// The field that replaces the text while a comment is edited. It is mounted only in edit mode,
// so it always starts from the saved text.
const CommentEditForm = ({ projectId, taskId, comment, onDone }: CommentEditFormProps) => {
    const [state, formAction, isPending] = useActionState(updateCommentAction, initialState)
    const [content, setContent] = useState<string>(comment.content)
    // Nothing to save when the text is empty or unchanged
    const canSubmit = !isBlank(content) && content.trim() !== comment.content

    useEffect(() => {
        if (state.success) onDone()
    }, [state.success, onDone])

    return (
        <form action={formAction} className="flex flex-col gap-2">
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="taskId" value={taskId} />
            <input type="hidden" name="commentId" value={comment.id} />
            <label>
                <span className="sr-only">Modifier le commentaire</span>
                <input
                    name="content"
                    type="text"
                    value={content}
                    onChange={event => setContent(event.target.value)}
                    autoComplete="off"
                    className="h-[44px] w-full rounded-[4px] border border-neutral-grey-200 bg-neutral-white px-4 text-sm focus:border-brand-dark-orange focus:outline-none focus:ring-1 focus:ring-brand-dark-orange"
                />
            </label>
            {state.message && <p role="alert" className="text-xs text-red-500">{state.message}</p>}
            <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={isPending || !canSubmit}
                    className="h-[36px] cursor-pointer rounded-[10px] bg-neutral-grey-800 px-5 text-sm text-neutral-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange disabled:cursor-not-allowed disabled:bg-neutral-grey-200 disabled:text-[#9ca3af]"
                >
                    Enregistrer
                </button>
                <button type="button" onClick={onDone} className={actionButtonClass}>Annuler</button>
            </div>
        </form>
    )
}

type CommentItemProps = {
    projectId: string
    taskId: string
    comment: ProjectTask['comments'][number]
    // True when the logged-in user wrote this comment: only then are "Modifier" and "Supprimer" offered
    canManage: boolean
}

// One comment of a task: author, date and text. Its author can edit it in place or delete it (after a confirmation).
// 'use client' because of the edit mode and the confirmation modal.
const CommentItem = ({ projectId, taskId, comment, canManage }: CommentItemProps) => {
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const authorName = getDisplayName(comment.author)
    const wasEdited = comment.updatedAt !== comment.createdAt

    return (
        <li className="flex items-start gap-3">
            <span className="flex size-[27px] shrink-0 items-center justify-center rounded-full bg-neutral-grey-200 text-[10px] text-neutral-grey-800">
                {getInitials(comment.author)}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="flex flex-wrap items-baseline gap-2 text-xs text-neutral-grey-800">
                    <span className="text-neutral-grey-950">{authorName}</span>
                    <time dateTime={comment.createdAt}>{formatCommentDate(comment.createdAt)}</time>
                    {wasEdited && <span>(modifié)</span>}
                </p>
                {isEditing ? (
                    <CommentEditForm projectId={projectId} taskId={taskId} comment={comment} onDone={() => setIsEditing(false)} />
                ) : (
                    <>
                        <p className="text-sm text-neutral-grey-950">{comment.content}</p>
                        {canManage && (
                            <div className="flex items-center gap-4">
                                <button type="button" onClick={() => setIsEditing(true)} aria-label={`Modifier votre commentaire du ${formatCommentDate(comment.createdAt)}`} className={actionButtonClass}>
                                    Modifier
                                </button>
                                <button type="button" onClick={() => setIsDeleting(true)} aria-label={`Supprimer votre commentaire du ${formatCommentDate(comment.createdAt)}`} className={actionButtonClass}>
                                    Supprimer
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
            {canManage && (
                <DeleteCommentModal
                    projectId={projectId}
                    taskId={taskId}
                    commentId={comment.id}
                    isOpen={isDeleting}
                    onClose={() => setIsDeleting(false)}
                />
            )}
        </li>
    )
}

export default CommentItem
