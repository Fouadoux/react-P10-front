import type { ApiResponse } from './types'

// Read on the server only: no NEXT_PUBLIC_ prefix, so the browser never sees this URL
const API_URL = process.env.API_URL

/**
 * Calls the Abricot back-end and returns its JSON envelope.
 *
 * @param path  endpoint path, e.g. "/dashboard/stats"
 * @param token the user's JWT (from the session cookie), or null for public endpoints like /auth/login
 * @param init  fetch options (method, body...), optional
 * @returns     always an ApiResponse<T>: the back's own JSON, or a fabricated ApiError if the network fails
 */
export const apiFetch = async <T>(
    path: string,
    token: string | null,
    init?: RequestInit,
): Promise<ApiResponse<T>> => {
    if (!API_URL) {
        return {success: false, message: 'API_URL is undefined', error: 'API_URL is undefined'}
    }
    try {
        const response = await fetch(`${API_URL}${path}`, {
            ...init, headers: {
                'Content-Type': 'application/json',
                ...(token ? {'Authorization': `Bearer ${token}`} : {})
            }
        })

        const contentType = response.headers.get('content-type')

        if (!contentType?.includes('application/json')) {
            return { success: false, message: 'Response is not JSON', error: 'INVALID_RESPONSE' }
        }

        return await response.json() as ApiResponse<T>
    } catch (error: unknown) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
            message: 'Failed to fetch.'
        }
    }
}
