import type { Task } from '@/lib/api/types';
import KanbanCard from '@/components/tasks/KanbanCard';


type KanbanColumnProps = {
    title: string
    tasks: Task[]
}

const KanbanColumn = ({ title, tasks }: KanbanColumnProps) => {
    return (
        <section className="flex flex-col gap-8 rounded-[10px] border border-neutral-grey-200 bg-neutral-white p-6">
            <h2 className="flex items-center gap-2 text-xl text-neutral-grey-950">
                {title}
                <span className="rounded-full bg-neutral-grey-200 px-2.5 py-0.5 text-sm text-neutral-grey-800">{tasks.length}</span>
            </h2>
            <ul className="flex flex-col gap-4">
                {tasks.map(task => (
                    <li key={task.id}>
                        <KanbanCard task={task} />
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default KanbanColumn
