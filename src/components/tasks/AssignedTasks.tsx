import TaskCard from '@/components/tasks/TaskCard'
import TaskSearch from '@/components/tasks/TaskSearch'
import { getAssignedTasks } from '@/lib/api/dashboard'
import { filterTasksByQuery } from '@/lib/taskSearch'
import { sortByPriority } from '@/lib/taskSort'

type AssignedTasksProps = {
    // Text typed in the search box ("" when nothing is searched)
    query: string
}

// "Mes tâches assignées" panel: fetches the tasks on the server and shows one card per task.
// Must be rendered inside a <Suspense> (it reads the session cookie at request time).
const AssignedTasks = async ({ query }: AssignedTasksProps) => {
    const tasks = sortByPriority(filterTasksByQuery(await getAssignedTasks(), query))

    return (
        <section className="flex flex-col gap-8 rounded-[10px] border border-neutral-grey-200 bg-neutral-white p-[54px]">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl text-neutral-grey-950">Mes tâches assignées</h2>
                    <p className="text-base text-neutral-grey-800">Par ordre de priorité</p>
                </div>
                <TaskSearch query={query} />
            </div>
            {tasks.length === 0 ? (
                <p className="text-neutral-grey-800">
                    {query ? 'Aucune tâche ne correspond à votre recherche.' : 'Aucune tâche ne vous est assignée.'}
                </p>
            ) : (
                <ul className="flex flex-col gap-4">
                    {tasks.map(task => (
                        <li key={task.id}>
                            <TaskCard task={task} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}

export default AssignedTasks
