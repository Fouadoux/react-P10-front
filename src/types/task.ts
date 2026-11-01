import type { Comment } from './comment'
import type { UserSummary } from './user'

// Statuses and priorities stored as plain strings by the backend
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TaskAssignee = {
    id: string;
    assignedAt: string;
    taskId: string;
    userId: string;
    user: UserSummary;
};

// A task as returned by GET /dashboard/assigned-tasks (with its project, assignees and comments)
export type Task = {
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
    project: {
        id: string;
        name: string;
        description: string | null;
    };
    assignees: TaskAssignee[];
    comments: Comment[];
};

// Content of `data` for a successful GET /dashboard/assigned-tasks
export type AssignedTasksData = {
    tasks: Task[];
};
