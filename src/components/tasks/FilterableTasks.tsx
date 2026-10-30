'use client'

import { useState } from 'react'
import TaskCard from '@/components/tasks/TaskCard'
import TaskSearch from '@/components/tasks/TaskSearch'
import type { Task } from '@/lib/api/types'
import { filterTasksByQuery } from '@/lib/taskSearch'

type FilterableTasksProps = {
    // Every assigned task, already sorted by priority
    tasks: Task[]
}

// "Mes tâches assignées" panel: the search box and the list of cards, filtered as the user types
const FilterableTasks = ({ tasks }: FilterableTasksProps) => {
    const [query, setQuery] = useState<string>('')
    const visibleTasks = filterTasksByQuery(tasks,query)

    return (
        <section className="flex flex-col gap-8 rounded-[10px] border border-neutral-grey-200 bg-neutral-white p-[54px]">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl text-neutral-grey-950">Mes tâches assignées</h2>
                    <p className="text-base text-neutral-grey-800">Par ordre de priorité</p>
                </div>
                <TaskSearch value={query} onChange={setQuery} />
            </div>
            {visibleTasks.length === 0 ? (
                <p className="text-neutral-grey-800">
                    {query ? 'Aucune tâche ne correspond à votre recherche.' : 'Aucune tâche ne vous est assignée.'}
                </p>
            ) : (
                <ul className="flex flex-col gap-4">
                    {visibleTasks.map(task => (
                        <li key={task.id}>
                            <TaskCard task={task} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}

export default FilterableTasks
