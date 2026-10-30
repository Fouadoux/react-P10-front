import Link from 'next/link'
import type { Task } from '@/lib/api/types'
import { STATUS_LABELS, STATUS_CLASSES } from '@/lib/taskLabels'
import TaskMeta from '@/components/tasks/TaskMeta';

type KanbanCardProps = {
    task: Task
}

// A task card of a Kanban column: title and status badge, description, project, due date, comments, link
const KanbanCard = ({task}: KanbanCardProps) => (
    <article className="flex flex-col items-start gap-4 rounded-[10px] border border-neutral-grey-200 bg-neutral-white px-10 py-8">
        <div className="flex w-full items-start justify-between gap-4">
            <h3 className="text-base font-medium text-neutral-grey-950">{task.title}</h3>
            <span className={`shrink-0 rounded-full px-3 py-1 text-xs ${STATUS_CLASSES[task.status]}`}>
                {STATUS_LABELS[task.status]}
            </span>
        </div>
        {task.description && <p className="text-sm text-neutral-grey-800">{task.description}</p>}
        <TaskMeta task={task}/>
        <Link
            href={`/projects/${task.projectId}`}
            className="rounded-[6px] bg-neutral-grey-950 px-8 py-3 text-sm text-neutral-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange"
        >
            Voir
        </Link>
    </article>
)

export default KanbanCard
