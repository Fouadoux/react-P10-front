'use server'

import { redirect } from 'next/navigation'
import { apiFetch } from '@/lib/api/client'
import { clearSession, setSession } from '@/lib/auth/session'
import type { LoginData } from '@/types'

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

export type RegisterState = {
    message: string | null
}

// Server Action: runs on the server when the registration form is submitted
export const registerAction = async (_previousState: RegisterState, formData: FormData): Promise<RegisterState> => {
    const email = String(formData.get('email') ?? '')
    const password = String(formData.get('password') ?? '')

    try {
        const response = await apiFetch<LoginData>('/auth/register', null, {
            method: 'POST',
            body: JSON.stringify({email,password}),
        })
        if(!response.success) {
            if(response.data){
                return { message: response.data.errors.map(e => e.message).join(', ') }
            }
            return { message: response.message}
        }
        await setSession(response.data.token)
    }catch (error) {
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
