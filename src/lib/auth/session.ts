import { cookies } from 'next/headers'
import { SESSION_COOKIE } from './constants'

// Reads the JWT from the request's cookies (server side only)
export const getToken = async (): Promise<string | null> => {
    const cookieStore = await cookies()
    return cookieStore.get(SESSION_COOKIE)?.value ?? null
}

export const setSession = async (token: string): Promise<void> => {
    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE,token,{
        httpOnly:true,
        maxAge: 60 * 60 * 24 * 7,
        secure:process.env.NODE_ENV==='production',
        sameSite:'lax',
        path: '/',
    })
}

export const clearSession = async (): Promise<void> => {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE)
}
