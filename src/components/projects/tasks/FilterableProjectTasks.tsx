'use client'

import { useState } from 'react'
import ProjectTaskCard from '@/components/projects/tasks/ProjectTaskCard'
import ProjectViewChips from '@/components/projects/tasks/ProjectViewChips'
import StatusFilterSelect from '@/components/projects/tasks/StatusFilterSelect'
import TaskCalendar from '@/components/projects/tasks/TaskCalendar'
import TaskSearch from '@/components/tasks/TaskSearch'
import type { ProjectView } from '@/lib/projects/view'
import { filterTasksByQuery, filterTasksByStatus, type StatusFilter } from '@/lib/tasks/search'
import type { ProjectTask, UserSummary } from '@/types'

type FilterableProjectTasksProps = {
    // Every task of the project, already sorted by priority
    tasks: ProjectTask[]
    // The members of the project (needed by the "Modifier" modal of each task)
    people: UserSummary[]
    // The logged-in user (null if unknown), passed on to the comments of each task
    currentUserId: string | null
    // The current date, read once on the server (the calendar shows the month of this date)
    today: Date
}

// "Tâches" panel of the project page: view chips, search box, status dropdown and the tasks
// (as cards or as a calendar), filtered as the user types
const FilterableProjectTasks = ({ tasks, people, currentUserId, today }: FilterableProjectTasksProps) => {
    const [view, setView] = useState<ProjectView>('list')
    const [query, setQuery] = useState<string>('')
    const [status, setStatus] = useState<StatusFilter>('ALL')
    const visibleTasks = filterTasksByStatus(filterTasksByQuery(tasks, query), status)
    const isFiltering = query !== '' || status !== 'ALL'

    return (
        <section className="flex flex-col gap-[41px] rounded-[10px] border border-neutral-grey-200 bg-neutral-white px-[59px] py-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h2 className="font-heading text-lg font-semibold text-neutral-grey-800">Tâches</h2>
                    <p className="text-base text-neutral-grey-500">
                        {view === 'list' ? 'Par ordre de priorité' : 'Échéances du mois en cours'}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <ProjectViewChips view={view} onChange={setView} />
                    {/* Fixed widths from the mockup (152 and 283 px). Without them the group is measured too narrow
                        and the search box drops to a second line. */}
                    <div className="w-[152px]">
                        <StatusFilterSelect value={status} onChange={setStatus} />
                    </div>
                    <div className="w-[283px] max-w-full">
                        <TaskSearch value={query} onChange={setQuery} />
                    </div>
                </div>
            </div>
            {view === 'calendar' ? (
                <TaskCalendar tasks={visibleTasks} today={today} />
            ) : visibleTasks.length === 0 ? (
                <p className="text-neutral-grey-800">
                    {isFiltering ? 'Aucune tâche ne correspond à votre recherche.' : 'Ce projet n’a pas encore de tâche.'}
                </p>
            ) : (
                <ul className="flex flex-col gap-4 md:px-10">
                    {visibleTasks.map(task => (
                        <li key={task.id}>
                            <ProjectTaskCard task={task} people={people} currentUserId={currentUserId} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    )
}

export default FilterableProjectTasks
