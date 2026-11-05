'use client'

import { useState } from 'react'
import ProjectTaskCard from '@/components/projects/ProjectTaskCard'
import StatusFilterSelect from '@/components/projects/StatusFilterSelect'
import TaskSearch from '@/components/tasks/TaskSearch'
import { filterTasksByQuery, filterTasksByStatus, type StatusFilter } from '@/lib/tasks/search'
import type { ProjectTask, UserSummary } from '@/types'

type FilterableProjectTasksProps = {
    // Every task of the project, already sorted by priority
    tasks: ProjectTask[]
    // The members of the project (needed by the "Modifier" modal of each task)
    people: UserSummary[]
}

// "Tâches" panel of the project page: search box, status dropdown and the cards, filtered as the user types
const FilterableProjectTasks = ({ tasks, people }: FilterableProjectTasksProps) => {
    const [query, setQuery] = useState<string>('')
    const [status, setStatus] = useState<StatusFilter>('ALL')
    const visibleTasks = filterTasksByStatus(filterTasksByQuery(tasks, query), status)
    const isFiltering = query !== '' || status !== 'ALL'

    return (
        <section className="flex flex-col gap-8 rounded-[10px] border border-neutral-grey-200 bg-neutral-white p-[54px]">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl text-neutral-grey-950">Tâches</h2>
                    <p className="text-base text-neutral-grey-800">Par ordre de priorité</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <StatusFilterSelect value={status} onChange={setStatus} />
                    <TaskSearch value={query} onChange={setQuery} />
                </div>
            </div>
            {visibleTasks.length === 0 ? (
                <p className="text-neutral-grey-800">
                    {isFiltering ? 'Aucune tâche ne correspond à votre recherche.' : 'Ce projet n’a pas encore de tâche.'}
                </p>
            ) : (
                <ul className="flex flex-col gap-4">
                    {visibleTasks.map(task => (
                        <li key={task.id}>
                            <ProjectTaskCard task={task} people={people} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}

export default FilterableProjectTasks
