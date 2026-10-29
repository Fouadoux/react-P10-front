import Image from 'next/image'
import Link from 'next/link'
import type { Task, TaskStatus } from '@/lib/api/types'
import { formatDueDate, STATUS_LABELS } from '@/lib/taskLabels'

// One look per status, taken from the mockup colors
const STATUS_CLASSES: Record<TaskStatus, string> = {
    TODO: 'bg-red-50 text-red-500',
    IN_PROGRESS: 'bg-amber-50 text-amber-500',
    DONE: 'bg-green-50 text-green-600',
    CANCELLED: 'bg-neutral-grey-50 text-neutral-grey-800',
}

type TaskCardProps = {
    task: Task
}

// A task of the "Mes tâches assignées" list: title, description, status badge, project, due date, comments
const TaskCard = ({ task }: TaskCardProps) => (
    <article className="flex items-stretch justify-between gap-6 rounded-[10px] border border-neutral-grey-200 bg-neutral-white px-9 py-8">
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h3 className="text-base font-medium text-neutral-grey-950">{task.title}</h3>
                {task.description && <p className="text-sm text-neutral-grey-800">{task.description}</p>}
            </div>
            <p className="flex flex-wrap items-center gap-3 text-xs text-neutral-grey-800">
                <span className="flex items-center gap-2">
                    <Image src="/icons/icon-folder-grey.svg" alt="Projet" width={18} height={14} />
                    {task.project.name}
                </span>
                <span aria-hidden="true">|</span>
                <span className="flex items-center gap-2">
                    <Image src="/icons/icon-calendar-grey.svg" alt="Échéance" width={15} height={17} />
                    {formatDueDate(task.dueDate)}
                </span>
                <span aria-hidden="true">|</span>
                <span className="flex items-center gap-2">
                    <Image src="/icons/icon-comment-grey.svg" alt="Commentaires" width={15} height={15} />
                    {task.comments.length}
                </span>
            </p>
        </div>
        <div className="flex flex-col items-end justify-between gap-4">
            <span className={`rounded-full px-3 py-1 text-xs ${STATUS_CLASSES[task.status]}`}>
                {STATUS_LABELS[task.status]}
            </span>
            <Link
                href={`/projects/${task.projectId}`}
                className="rounded-[6px] bg-neutral-grey-950 px-8 py-3 text-sm text-neutral-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange"
            >
                Voir
            </Link>
        </div>
    </article>
)

export default TaskCard
