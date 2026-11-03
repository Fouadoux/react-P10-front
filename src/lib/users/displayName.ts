import type { UserSummary } from '@/types'

/**
 * Name shown for a user ("Alice Dupont", or the email when there is no name).
 *
 * @param user a user (the logged-in one, or a project member), or null if the session is no longer valid.
 *             Only name and email are read, so both User and UserSummary fit.
 * @returns    the text to display
 */
export const getDisplayName = (user: Pick<UserSummary, 'name' | 'email'> | null): string => {
    if (!user) return 'Utilisateur'
    return user.name ?? user.email
}
