import { authFetch } from '@/lib/api/client'
import type { AssignedTasksData, Task } from '@/lib/api/types'

// Asks the backend for the tasks assigned to the logged-in user (most urgent first).
// Returns an empty list when nobody is logged in or when the backend refuses.
export const getAssignedTasks = async (): Promise<Task[]> => {
    const res = await authFetch<AssignedTasksData>('/dashboard/assigned-tasks')
    return res.success ? res.data.tasks : []
}
