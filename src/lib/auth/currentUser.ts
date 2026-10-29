import type { ProfileData, User } from '@/lib/api/types'
import { authFetch } from '@/lib/api/client';

// Asks the backend who is logged in, using the token stored in the session cookie.
// Returns the user, or null when nobody is logged in (no cookie, or the token is rejected).
export const getCurrentUser = async (): Promise<User | null> => {
    const res = await authFetch<ProfileData>('/auth/profile')
    return res.success ? res.data.user : null
}
