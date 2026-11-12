import type { Task } from '@/types';
import { formatDueDate } from '@/lib/tasks/labels';
import Image from 'next/image';

type TaskMetaProps = {
    task: Task;
}

const TaskMeta = ({task}: TaskMetaProps) => {
    return (

        <p className="flex flex-wrap items-center gap-3 text-xs text-neutral-grey-500">
                <span className="flex items-center gap-2">
                    <Image src="/icons/icon-folder-grey.svg" alt="Projet" width={18} height={14}/>
                    {task.project.name}
                </span>
            <span aria-hidden="true">|</span>
            <span className="flex items-center gap-2">
                    <Image src="/icons/icon-calendar-grey.svg" alt="Échéance" width={15} height={17}/>
                {formatDueDate(task.dueDate)}
                </span>
            <span aria-hidden="true">|</span>
            <span className="flex items-center gap-2">
                    <Image src="/icons/icon-comment-grey.svg" alt="Commentaires" width={15} height={15}/>
                {task.comments.length}
                </span>
        </p>
    )
}


export default TaskMeta;
