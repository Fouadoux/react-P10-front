import { authFetch } from '@/lib/api/client'
import type { AssignedTasksData, Task } from '@/types'

// Asks the backend for the tasks assigned to the logged-in user (most urgent first).
// Throws when the backend fails: the nearest error.tsx shows the error page.
// (An expired token never gets here: authFetch has already redirected to /api/logout.)
export const getAssignedTasks = async (): Promise<Task[]> => {
    const res = await authFetch<AssignedTasksData>('/dashboard/assigned-tasks')
    if (!res.success) {
        throw new Error(res.message)
    }
    return res.data.tasks
}
