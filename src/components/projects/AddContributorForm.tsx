'use client'

import { useActionState, useState } from 'react'
import { addContributorAction, type CreateProjectState } from '@/app/actions/projects'
import TextField from '@/components/ui/TextField'

const initialState: CreateProjectState = { message: null, success: false }

type AddContributorFormProps = {
    projectId: string
}

// Email field and "Ajouter" button: adds one person to the project
const AddContributorForm = ({ projectId }: AddContributorFormProps) => {
    const [email, setEmail] = useState<string>('')

    // Empty the field once the person is added (kept after a failure, so the user can fix a typo)
    const addAndClear = async (previousState: CreateProjectState, formData: FormData): Promise<CreateProjectState> => {
        const result = await addContributorAction(previousState, formData)
        if (result.success) setEmail('')
        return result
    }
    const [state, formAction, isPending] = useActionState(addAndClear, initialState)

    return (
        <form action={formAction} className="flex w-full flex-col gap-3">
            <input type="hidden" name="projectId" value={projectId} />
            <TextField
                label="Ajouter un contributeur"
                name="email"
                type="email"
                placeholder="alice@example.com"
                autoComplete="off"
                value={email}
                onChange={setEmail}
            />
            {state.message && <p role="alert" className="text-red-500">{state.message}</p>}
            <button
                type="submit"
                disabled={isPending}
                className="h-[40px] w-fit cursor-pointer rounded-[10px] border border-neutral-grey-800 px-6 text-sm text-neutral-grey-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange disabled:cursor-not-allowed disabled:opacity-50"
            >
                Ajouter
            </button>
        </form>
    )
}

export default AddContributorForm
