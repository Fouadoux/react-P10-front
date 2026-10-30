import KanbanColumn from '@/components/dashboard/KanbanColumn'
import { getAssignedTasks } from '@/lib/api/dashboard'
import { getTasksOfMonth, groupTasksByStatus } from '@/lib/taskGroups'

// Kanban view: the assigned tasks due this month, split into one column per status.
// Must be rendered inside a <Suspense> (it reads the session cookie at request time).
const KanbanBoard = async () => {
    const tasks = await getAssignedTasks()
    const today = new Date()
    const tasksOfMonth = getTasksOfMonth(tasks, today)
    const { TODO, IN_PROGRESS, DONE } = groupTasksByStatus(tasksOfMonth)

    return (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <KanbanColumn title="À faire" tasks={TODO} />
            <KanbanColumn title="En cours" tasks={IN_PROGRESS} />
            <KanbanColumn title="Terminées" tasks={DONE} />
        </div>
    )
}

export default KanbanBoard
