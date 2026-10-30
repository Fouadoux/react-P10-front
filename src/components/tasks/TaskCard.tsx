import Link from 'next/link'
import type { Task } from '@/lib/api/types'
import { STATUS_LABELS, STATUS_CLASSES } from '@/lib/taskLabels'
import TaskMeta from '@/components/tasks/TaskMeta';

type TaskCardProps = {
    task: Task
}

// A task of the "Mes tâches assignées" list: title, description, status badge, project, due date, comments
const TaskCard = ({task}: TaskCardProps) => (
    <article
        className="flex items-stretch justify-between gap-6 rounded-[10px] border border-neutral-grey-200 bg-neutral-white px-9 py-8">
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <h3 className="text-base font-medium text-neutral-grey-950">{task.title}</h3>
                {task.description && <p className="text-sm text-neutral-grey-800">{task.description}</p>}
            </div>
            <TaskMeta task={task}/>
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
