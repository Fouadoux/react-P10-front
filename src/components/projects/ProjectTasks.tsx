import FilterableProjectTasks from '@/components/projects/tasks/FilterableProjectTasks'
import { getProjectTasks } from '@/lib/projects/api'
import { sortByPriority } from '@/lib/tasks/sort'
import type { UserSummary } from '@/types'

type ProjectTasksProps = {
    projectId: string
    // The members of the project: the people a task can be assigned to when editing it
    people: UserSummary[]
    // The logged-in user, to let them edit and delete their own comments (null if unknown)
    currentUserId: string | null
}

// Fetches the project's tasks on the server and sorts them by priority;
// the search box, the status filter and the list live in FilterableProjectTasks (browser side).
// Must be rendered inside a <Suspense> (it reads the session cookie at request time).
const ProjectTasks = async ({ projectId, people, currentUserId }: ProjectTasksProps) => {
    const tasks = sortByPriority(await getProjectTasks(projectId))

    // The date is read here, on the server, and handed down: the calendar must not call `new Date()` while rendering
    return <FilterableProjectTasks tasks={tasks} people={people} currentUserId={currentUserId} today={new Date()} />
}

export default ProjectTasks
