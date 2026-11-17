'use server'

import { revalidatePath } from 'next/cache'
import { apiFetch, authFetch } from '@/lib/api/client'
import { getToken } from '@/lib/auth/session'
import { isBlank } from '@/lib/forms/isBlank'
import type { ProfileData } from '@/types'

// What the "Mon compte" form shows after a submit: an error message, or success
export type AccountFormState = {
    message: string | null
    success: boolean
}

// Server Action: sends the new name and email of the logged-in user to the backend
export const updateProfileAction = async (_previousState: AccountFormState, formData: FormData): Promise<AccountFormState> => {
    // The keys must match the `name` attribute of the form's inputs
    const firstName = String(formData.get('firstName') ?? '').trim()
    const lastName = String(formData.get('lastName') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    // The backend stores ONE name: trim() removes the trailing space when there is no last name ("Prince")
    const name = `${firstName} ${lastName}`.trim()

    const response = await authFetch<ProfileData>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ name, email }),
    })

    if (!response.success) {
        if (response.data) {
            return { message: response.data.errors.map(e => e.message).join(', '), success: false }
        }
        return { message: response.message, success: false }
    }
    // Refresh the whole layout so the avatar initials in the menu follow the new name
    revalidatePath('/', 'layout')
    return { message: null, success: true }
}

// Server Action: changes the password (the backend wants the current one to accept the new one)
export const updatePasswordAction = async (_previousState: AccountFormState, formData: FormData): Promise<AccountFormState> => {
    const currentPassword = String(formData.get('currentPassword') ?? '')
    const newPassword = String(formData.get('newPassword') ?? '')

    const token = await getToken()
    if (!token) return { message: "Vous n'êtes plus connecté.", success: false }

    // apiFetch and not authFetch on purpose: a wrong current password makes the backend answer 401,
    // and authFetch treats every 401 as an expired token, which would log the user out
    const response = await apiFetch<null>('/auth/password', token, {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
    })

    if (!response.success) {
        if (response.data) {
            return { message: response.data.errors.map(e => e.message).join(', '), success: false }
        }
        return { message: response.message, success: false }
    }
    return { message: null, success: true }
}

// Server Action of the whole "Mon compte" form: saves the name and email, then the password if a new one was typed
export const updateAccountAction = async (previousState: AccountFormState, formData: FormData): Promise<AccountFormState> => {
    const profileResult = await updateProfileAction(previousState, formData)
    if (!profileResult.success) return profileResult

    const newPassword = String(formData.get('newPassword') ?? '')
    if (isBlank(newPassword)) return profileResult

    const passwordResult = await updatePasswordAction(previousState, formData)
    if (!passwordResult.success) {
        // The profile is already saved at this point: say it, so the user does not retype everything
        return { message: `Vos informations sont enregistrées, mais le mot de passe n'a pas été modifié : ${passwordResult.message}`, success: false }
    }
    return passwordResult
}
