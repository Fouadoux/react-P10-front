import type { User } from '@/lib/api/types'

/**
 * Builds the letters displayed in the avatar (e.g. "Alice Dupont" -> "AD").
 *
 * @param user the logged-in user, or null if none
 * @returns    the initials in upper case, never an empty string
 */
export const getInitials = (user: User | null): string => {
    if (!user) return '?'

    // trim() BEFORE the emptiness test; "?." avoids a crash when name is null
    const name = user.name?.trim() || user.email.trim()
    if (!name) return '?'

    const words = name.split(/\s+/)
    const first = words[0].charAt(0)

    // One word: a single letter ("Alice" -> "A")
    if (words.length === 1) return first.toUpperCase()

    // Two words or more: first + last ("Alice Marie Dupont" -> "AD")
    const last = words[words.length - 1].charAt(0)
    return (first + last).toUpperCase()
}
