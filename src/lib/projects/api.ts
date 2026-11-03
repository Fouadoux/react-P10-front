import { authFetch } from '@/lib/api/client'
import type { Project, ProjectsData, ProjectTasksData } from '@/types'

// Asks the backend for the projects the logged-in user owns or contributes to (most recently updated first).
// Throws when the backend fails: the nearest error.tsx shows the error page.
export const getProjects = async (): Promise<Project[]> => {
    const res = await authFetch<ProjectsData>('/projects')
    if (!res.success) {
        throw new Error(res.message)
    }
    return res.data.projects
}

// Asks the backend for the tasks of one project (only id and status: enough to compute its progress).
// Throws when the backend fails, like getProjects.
export const getProjectTasks = async (projectId: string): Promise<ProjectTasksData['tasks']> => {
    const res = await authFetch<ProjectTasksData>(`/projects/${projectId}/tasks`)
    if (!res.success) {
        throw new Error(res.message)
    }
    return res.data.tasks
}
