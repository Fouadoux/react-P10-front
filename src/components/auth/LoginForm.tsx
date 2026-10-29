'use client'

import { useActionState, useState } from 'react'
import { loginAction, type LoginState } from '@/app/actions/auth'
import TextField from '@/components/ui/TextField'
import Button from '@/components/ui/Button'

const initialState: LoginState = { message: null }

// Client component: it holds the typed values and the pending/error state of the Server Action
const LoginForm = () => {
    const [state, formAction, isPending] = useActionState(loginAction, initialState)
    // Controlled fields keep what the user typed even after a failed attempt
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    return (
        <form action={formAction} className="flex w-full flex-col items-center gap-7.25">
            <TextField label="Email" name="email" type="email" autoComplete="email" value={email} onChange={setEmail} />
            <TextField label="Mot de passe" name="password" type="password" autoComplete="current-password" value={password} onChange={setPassword} />
            {state.message && <p role="alert" className="text-red-500">{state.message}</p>}
            <Button label="Se connecter" type="submit" disabled={isPending} />
        </form>
    )
}

export default LoginForm
