import KanbanDragBoard from '@/components/dashboard/KanbanDragBoard'
import { getAssignedTasks } from '@/lib/tasks/api'
import { getTasksOfMonth } from '@/lib/tasks/groups'

// Kanban view: the assigned tasks due this month. They are fetched here, on the server;
// the columns and the drag and drop live in KanbanDragBoard (browser side).
// Must be rendered inside a <Suspense> (it reads the session cookie at request time).
const KanbanBoard = async () => {
    const tasks = await getAssignedTasks()
    const today = new Date()
    const tasksOfMonth = getTasksOfMonth(tasks, today)

    return <KanbanDragBoard tasks={tasksOfMonth} />
}

export default KanbanBoard
