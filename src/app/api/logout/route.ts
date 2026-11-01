import { redirect } from 'next/navigation'
import { clearSession } from '@/lib/auth/session'

// Route Handler: GET /api/logout deletes the session cookie, then sends the visitor to the login page.
// Used when the backend refuses the token: a Server Component cannot delete a cookie, a Route Handler can.
export const GET = async (): Promise<never> => {
    await clearSession()
    redirect(`/login`)
}
