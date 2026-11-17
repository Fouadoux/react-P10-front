'use client'

import { useActionState, useState } from 'react'
import { updateAccountAction, type AccountFormState } from '@/app/actions/account'
import Button from '@/components/ui/Button'
import TextField from '@/components/ui/TextField'
import { isBlank } from '@/lib/forms/isBlank'
import { splitName } from '@/lib/users/splitName'
import type { User } from '@/types'

const initialState: AccountFormState = { message: null, success: false }

type AccountFormProps = {
    user: User
}

// Form of the "Mon compte" page: first name, last name, email, and an optional password change.
// 'use client' because it holds the typed values and reacts to the result of the Server Action.
const AccountForm = ({ user }: AccountFormProps) => {
    const [state, formAction, isPending] = useActionState(updateAccountAction, initialState)
    // The backend stores one name: splitName cuts it into the two fields of the mockup
    const initialName = splitName(user.name)
    const [firstName, setFirstName] = useState<string>(initialName.firstName)
    const [lastName, setLastName] = useState<string>(initialName.lastName)
    const [email, setEmail] = useState<string>(user.email)
    const [currentPassword, setCurrentPassword] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')

    // Once the password is saved, empty both fields (adjusting state while rendering: no useEffect needed)
    const [handledState, setHandledState] = useState<AccountFormState>(state)
    if (state !== handledState) {
        setHandledState(state)
        if (state.success) {
            setCurrentPassword('')
            setNewPassword('')
        }
    }

    const hasProfileChanges = firstName !== initialName.firstName || lastName !== initialName.lastName || email !== user.email
    const wantsNewPassword = !isBlank(newPassword)
    // Something to save, an email, and the current password whenever a new one is typed
    const canSubmit = (hasProfileChanges || wantsNewPassword) && !isBlank(email) && (!wantsNewPassword || !isBlank(currentPassword))

    return (
        <form action={formAction} className="flex w-full flex-col gap-6">
            <TextField label="Prénom" name="firstName" type="text" autoComplete="given-name" value={firstName} onChange={setFirstName} />
            <TextField label="Nom" name="lastName" type="text" autoComplete="family-name" value={lastName} onChange={setLastName} />
            <TextField label="Email" name="email" type="email" autoComplete="email" value={email} onChange={setEmail} />
            <fieldset className="flex flex-col gap-6">
                <legend className="mb-2 text-sm text-neutral-grey-800">Changer de mot de passe (facultatif)</legend>
                <TextField label="Mot de passe actuel" name="currentPassword" type="password" autoComplete="current-password" value={currentPassword} onChange={setCurrentPassword} />
                <TextField label="Nouveau mot de passe" name="newPassword" type="password" autoComplete="new-password" value={newPassword} onChange={setNewPassword} />
            </fieldset>
            {state.message && <p role="alert" className="text-red-700">{state.message}</p>}
            {state.success && <p role="status" className="text-green-700">Vos informations ont bien été modifiées.</p>}
            <div>
                <Button label="Modifier les informations" type="submit" disabled={isPending || !canSubmit} />
            </div>
        </form>
    )
}

export default AccountForm
