import Image from 'next/image'
import type { ProjectTask } from '@/types'
import { formatDueDate, STATUS_CLASSES, STATUS_LABELS } from '@/lib/tasks/labels'
import { getDisplayName } from '@/lib/users/displayName'
import { getInitials } from '@/lib/users/initials'

type ProjectTaskCardProps = {
    task: ProjectTask
}

// A task of the project page: title and status badge, description, due date, assignees, number of comments
const ProjectTaskCard = ({ task }: ProjectTaskCardProps) => {
    return (
        <article className="flex flex-col gap-6 rounded-[10px] border border-neutral-grey-200 bg-neutral-white px-8 pt-8">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-base text-neutral-grey-950">{task.title}</h3>
                        <span className={`rounded-full px-3 py-1 text-xs ${STATUS_CLASSES[task.status]}`}>
                            {STATUS_LABELS[task.status]}
                        </span>
                    </div>
                    {task.description && <p className="text-sm text-neutral-grey-800">{task.description}</p>}
                </div>

                <p className="flex items-center gap-2 text-xs text-neutral-grey-800">
                    Échéance :
                    <Image src="/icons/icon-calendar-grey.svg" alt="" width={15} height={17} />
                    <span className="text-neutral-grey-950">{formatDueDate(task.dueDate)}</span>
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-grey-800">
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
                                    <span className="rounded-full bg-neutral-grey-200 px-3 py-1 text-neutral-grey-800">
                                        {getDisplayName(assignee.user)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <p className="border-t border-neutral-grey-200 py-4 text-xs text-neutral-grey-950">
                Commentaires ({task.comments.length})
            </p>
        </article>
    )
}

export default ProjectTaskCard
