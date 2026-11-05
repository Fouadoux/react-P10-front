import FilterableProjectTasks from '@/components/projects/FilterableProjectTasks'
import { getProjectTasks } from '@/lib/projects/api'
import { sortByPriority } from '@/lib/tasks/sort'
import type { UserSummary } from '@/types'

type ProjectTasksProps = {
    projectId: string
    // The members of the project: the people a task can be assigned to when editing it
    people: UserSummary[]
}

// Fetches the project's tasks on the server and sorts them by priority;
// the search box, the status filter and the list live in FilterableProjectTasks (browser side).
// Must be rendered inside a <Suspense> (it reads the session cookie at request time).
const ProjectTasks = async ({ projectId, people }: ProjectTasksProps) => {
    const tasks = sortByPriority(await getProjectTasks(projectId))

    return <FilterableProjectTasks tasks={tasks} people={people} />
}

export default ProjectTasks
