import CommentForm from '@/components/projects/tasks/CommentForm'
import CommentItem from '@/components/projects/tasks/CommentItem'
import type { ProjectTask } from '@/types'

type TaskCommentsProps = {
    projectId: string
    taskId: string
    comments: ProjectTask['comments']
    // The logged-in user (null if unknown): the comments they wrote can be edited and deleted
    currentUserId: string | null
}

// "Commentaires (N)" bar at the bottom of a task card. A native <details> is the accordion:
// the browser handles opening, closing and the keyboard (Enter / Space), no state and no library needed.
const TaskComments = ({ projectId, taskId, comments, currentUserId }: TaskCommentsProps) => (
    <details className="group border-t border-neutral-grey-200">
        <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm text-neutral-grey-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange">
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
                        <CommentItem
                            key={comment.id}
                            projectId={projectId}
                            taskId={taskId}
                            comment={comment}
                            canManage={currentUserId !== null && comment.author.id === currentUserId}
                        />
                    ))}
                </ul>
            )}
            <CommentForm projectId={projectId} taskId={taskId} />
        </div>
    </details>
)

export default TaskComments
