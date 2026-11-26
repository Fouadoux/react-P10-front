import Image from 'next/image'
import TaskComments from '@/components/projects/tasks/TaskComments'
import TaskMenu from '@/components/projects/tasks/TaskMenu'
import type { ProjectTask, UserSummary } from '@/types'
import { formatDueDate, STATUS_CLASSES, STATUS_LABELS } from '@/lib/tasks/labels'
import { getDisplayName } from '@/lib/users/displayName'
import { getInitials } from '@/lib/users/initials'

type ProjectTaskCardProps = {
    task: ProjectTask
    // The members of the project (needed by the edit modal of the "…" menu)
    people: UserSummary[]
    // The logged-in user (null if unknown), to know which comments they can edit
    currentUserId: string | null
}

// A task of the project page: title and status badge, description, due date, assignees, number of comments,
// and the "…" menu (edit, delete)
const ProjectTaskCard = ({ task, people, currentUserId }: ProjectTaskCardProps) => {
    return (
        <article className="relative flex flex-col gap-6 rounded-[10px] border border-neutral-grey-200 bg-neutral-white px-8 pt-8">
            <div className="absolute right-8 top-8">
                <TaskMenu task={task} people={people} />
            </div>
            <div className="flex flex-col gap-4 pr-16">
                <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-heading text-lg font-semibold text-black">{task.title}</h3>
                        <span className={`rounded-full px-4 py-1 text-sm leading-[17px] ${STATUS_CLASSES[task.status]}`}>
                            {STATUS_LABELS[task.status]}
                        </span>
                    </div>
                    {task.description && <p className="text-sm text-neutral-grey-500">{task.description}</p>}
                </div>

                <p className="flex items-center gap-2 text-xs text-neutral-grey-500">
                    Échéance :
                    <Image src="/icons/icon-calendar-grey.svg" alt="" width={15} height={17} />
                    <span className="text-neutral-grey-950">{formatDueDate(task.dueDate)}</span>
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-grey-500">
                    <span>Assigné à :</span>
                    {task.assignees.length === 0 ? (
                        <span>personne</span>
                    ) : (
                        <ul className="flex flex-wrap items-center gap-3">
                            {task.assignees.map(assignee => (
                                <li key={assignee.id} className="flex items-center gap-2">
                                    <span className="flex size-[22px] items-center justify-center rounded-full bg-neutral-grey-200 text-[9px] text-neutral-grey-800">
                                        {getInitials(assignee.user)}
                                    </span>
                                    <span className="rounded-full bg-neutral-grey-200 px-3 py-1 text-sm text-neutral-grey-500">
                                        {getDisplayName(assignee.user)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <TaskComments projectId={task.projectId} taskId={task.id} comments={task.comments} currentUserId={currentUserId} />
        </article>
    )
}

export default ProjectTaskCard
