'use client'

import { useActionState, useEffect, useState } from 'react'
import { createProjectAction, type CreateProjectState } from '@/app/actions/projects'
import Button from '@/components/ui/Button'
import TextField from '@/components/ui/TextField'

const initialState: CreateProjectState = { message: null, success: false }

type CreateProjectFormProps = {
    // Called once the project is created, so the modal can close
    onSuccess: () => void
}

// Form of the "Créer un projet" modal. Client component: it holds the typed values and the pending/error state.
const CreateProjectForm = ({ onSuccess }: CreateProjectFormProps) => {
    const [state, formAction, isPending] = useActionState(createProjectAction, initialState)
    // Controlled fields keep what the user typed even after a failed attempt
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [contributors, setContributors] = useState<string>('')

    // Tell the modal to close when the Server Action reports a success
    useEffect(() => {
        if (state.success) onSuccess()
    }, [state.success, onSuccess])

    return (
        <form action={formAction} className="flex w-full flex-col items-start gap-6">
            <TextField label="Titre*" name="name" type="text" value={name} onChange={setName} />
            <TextField label="Description*" name="description" type="text" value={description} onChange={setDescription} />
            <TextField
                label="Contributeurs"
                name="contributors"
                type="text"
                placeholder="alice@example.com, bob@example.com"
                value={contributors}
                onChange={setContributors}
            />
            {state.message && <p role="alert" className="text-red-500">{state.message}</p>}
            <Button label="Ajouter un projet" type="submit" disabled={isPending} />
        </form>
    )
}

export default CreateProjectForm
