export type Errors = {
    field: string,
    message: string,
}

export type User = {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
};

// Content of `data` for a successful POST /auth/login
export type LoginData = {
    user: User;
    token: string;
};

// Statuses and priorities stored as plain strings by the backend
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// The user fields the backend exposes inside tasks and comments
export type UserSummary = {
    id: string;
    name: string | null;
    email: string;
};

export type Comment = {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    taskId: string;
    authorId: string;
    author: UserSummary;
};

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

// Content of `data` for a successful GET /auth/profile
export type ProfileData = {
    user: User;
};

// Envelope of every successful backend response; T is the shape of `data`
export type ApiSuccess<T> = {
    success: true;
    message: string;
    data: T;
};

// Envelope of every failed backend response
// `data.errors` is only present for 400 validation errors
export type ApiError = {
    success: false;
    message: string;
    error?: string;
    data?: {
        errors: Errors[];
    };
};

// Discriminated union: checking `success` tells TypeScript which one it is
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
