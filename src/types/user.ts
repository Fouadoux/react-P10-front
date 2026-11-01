export type User = {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
};

// The user fields the backend exposes inside tasks and comments
export type UserSummary = {
    id: string;
    name: string | null;
    email: string;
};

// Content of `data` for a successful POST /auth/login
export type LoginData = {
    user: User;
    token: string;
};

// Content of `data` for a successful GET /auth/profile
export type ProfileData = {
    user: User;
};
