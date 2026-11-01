import FilterableTasks from '@/components/tasks/FilterableTasks'
import { getAssignedTasks } from '@/lib/tasks/api'
import { sortByPriority } from '@/lib/tasks/sort'

// Fetches the assigned tasks on the server and sorts them by priority;
// the search box and the list live in FilterableTasks (browser side, so the filter reacts to each keystroke).
// Must be rendered inside a <Suspense> (it reads the session cookie at request time).
const AssignedTasks = async () => {
    const tasks = sortByPriority(await getAssignedTasks())

    return <FilterableTasks tasks={tasks} />
}

export default AssignedTasks
