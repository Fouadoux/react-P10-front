import type { TaskStatus } from './task'
import type { UserSummary } from './user'

export type ProjectRole = 'ADMIN' | 'CONTRIBUTOR';

export type ProjectMember = {
    id: string;
    role: ProjectRole;
    joinedAt: string;
    userId: string;
    projectId: string;
    user: UserSummary;
};

// A project as returned by GET /projects
// `userRole` is the role of the logged-in user in this project (null if none)
export type Project = {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    owner: UserSummary;
    members: ProjectMember[];
    _count: {
        tasks: number;
    };
    userRole: ProjectRole | null;
};

// Content of `data` for a successful GET /projects
export type ProjectsData = {
    projects: Project[];
};

// Content of `data` for a successful POST /projects (the created project)
export type CreateProjectData = {
    project: Project;
};

// Content of `data` for a successful GET /projects/:id/tasks
// (only the fields we read are described: the progress bar needs the status of each task)
export type ProjectTasksData = {
    tasks: { id: string; status: TaskStatus }[];
};
