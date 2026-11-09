import CommentForm from '@/components/projects/CommentForm'
import { formatCommentDate } from '@/lib/tasks/labels'
import { getDisplayName } from '@/lib/users/displayName'
import { getInitials } from '@/lib/users/initials'
import type { ProjectTask } from '@/types'

type TaskCommentsProps = {
    projectId: string
    taskId: string
    comments: ProjectTask['comments']
}

// "Commentaires (N)" bar at the bottom of a task card. A native <details> is the accordion:
// the browser handles opening, closing and the keyboard (Enter / Space), no state and no library needed.
const TaskComments = ({ projectId, taskId, comments }: TaskCommentsProps) => (
    <details className="group border-t border-neutral-grey-200">
        <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-xs text-neutral-grey-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange">
            Commentaires ({comments.length})
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-open:rotate-180">
                <path d="M1 1.5l5 5 5-5" />
            </svg>
        </summary>
        <div className="flex flex-col gap-4 pb-6">
            {comments.length === 0 ? (
                <p className="text-xs text-neutral-grey-800">Aucun commentaire pour le moment.</p>
            ) : (
                <ul className="flex flex-col gap-4">
                    {comments.map(comment => (
                        <li key={comment.id} className="flex items-start gap-3">
                            <span className="flex size-[27px] shrink-0 items-center justify-center rounded-full bg-neutral-grey-200 text-[10px] text-neutral-grey-800">
                                {getInitials(comment.author)}
                            </span>
                            <div className="flex flex-col gap-1">
                                <p className="flex flex-wrap items-baseline gap-2 text-xs text-neutral-grey-800">
                                    <span className="text-neutral-grey-950">{getDisplayName(comment.author)}</span>
                                    <time dateTime={comment.createdAt}>{formatCommentDate(comment.createdAt)}</time>
                                </p>
                                <p className="text-sm text-neutral-grey-950">{comment.content}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <CommentForm projectId={projectId} taskId={taskId} />
        </div>
    </details>
)

export default TaskComments
