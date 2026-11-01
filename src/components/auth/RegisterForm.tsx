'use client'

import { useState } from 'react';
import { useActionState } from 'react';
import { registerAction, type RegisterState} from '@/app/actions/auth';
import TextField from '@/components/ui/TextField';
import Button from '@/components/ui/Button';

const initialState: RegisterState = { message: null }


const RegisterForm = () => {
    const [state, formAction, isPending] = useActionState(registerAction, initialState)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    return (
        <form action={formAction} className="flex w-full flex-col items-center gap-7.25">
            <TextField label="Email" name="email" type="email" autoComplete="email" value={email} onChange={setEmail} />
            <TextField label="Mot de passe" name="password" type="password" autoComplete="new-password" value={password} onChange={setPassword} />
            {state.message && <p role="alert" className="text-red-500">{state.message}</p>}
            <Button label="S'inscrire" type="submit" disabled={isPending} />
        </form>
    )
}

export default RegisterForm
