'use server'

import { redirect } from 'next/navigation'
import { apiFetch } from '@/lib/api/client'
import { clearSession, setSession } from '@/lib/auth/session'
import type { LoginData } from '@/lib/api/types'

export type LoginState = {
    message: string | null
}

// Server Action: runs on the server when the login form is submitted
export const loginAction = async (_previousState: LoginState, formData: FormData): Promise<LoginState> => {
    // FormData values are `string | File | null`: String() gives us the text the user typed
    const email = String(formData.get('email') ?? '')
    const password = String(formData.get('password') ?? '')

    try {
        const res = await apiFetch<LoginData>('/auth/login', null, {
            method: 'POST',
            body: JSON.stringify({email, password})
        })
        if (!res.success) {
            return {message: res.message}
        }
        await setSession(res.data.token)

    } catch (error) {
        console.error(error)
        return {message: 'error'}
    }
    redirect('/dashboard')
}

// Server Action: deletes the session cookie, then sends the visitor back to the login page
export const logoutAction = async (): Promise<void> => {
    await clearSession()
    redirect('/login')
}
