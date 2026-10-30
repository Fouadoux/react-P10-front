import type { User } from '@/lib/api/types'

/**
 * Name shown in the dashboard greeting ("Bonjour Alice Dupont, ...").
 *
 * @param user the logged-in user, or null if the session is no longer valid
 * @returns    the text to put after "Bonjour"
 */
export const getDisplayName = (user: User | null): string => {
    if (!user) return 'Utilisateur'
    return user.name ?? user.email
}
