import type { TaskPriority, TaskStatus } from './task'
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

// Content of `data` for a successful GET /projects/:id (one project)
// (the backend also sends the project's tasks here; we read them from /projects/:id/tasks instead)
export type ProjectData = {
    project: Project;
};

// Content of `data` for a successful POST /projects: the created project
export type CreateProjectData = ProjectData;

// Content of `data` for a successful POST /projects/:id/tasks (we only need the id of the created task)
export type CreateTaskData = {
    task: { id: string };
};

// A task as returned by GET /projects/:id/tasks.
// Not the same shape as the dashboard's Task: assignees and comments carry fewer fields here.
export type ProjectTask = {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
    projectId: string;
    creatorId: string;
    creator: UserSummary;
    project: { id: string; name: string };
    assignees: { id: string; assignedAt: string; user: UserSummary }[];
    comments: { id: string; content: string; createdAt: string; updatedAt: string; author: UserSummary }[];
};

// Content of `data` for a successful GET /projects/:id/tasks
export type ProjectTasksData = {
    tasks: ProjectTask[];
};
