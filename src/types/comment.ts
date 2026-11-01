import type { UserSummary } from './user'

export type Comment = {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    taskId: string;
    authorId: string;
    author: UserSummary;
};
