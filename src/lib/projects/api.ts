import { authFetch } from '@/lib/api/client'
import type { Project, ProjectData, ProjectsData, ProjectTasksData } from '@/types'

// Asks the backend for one project. Returns null when it does not exist (404) or when the
// logged-in user is not allowed to see it (403); any other failure throws, like getProjects.
export const getProject = async (projectId: string): Promise<Project | null> => {
    const res = await authFetch<ProjectData>(`/projects/${projectId}`)
    if (!res.success) {
        if (res.status === 404 || res.status === 403) return null
        throw new Error(res.message)
    }
    return res.data.project
}

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
