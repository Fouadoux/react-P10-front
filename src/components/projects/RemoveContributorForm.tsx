'use client'

import { useActionState } from 'react'
import { removeContributorAction, type CreateProjectState } from '@/app/actions/projects'

const initialState: CreateProjectState = { message: null, success: false }

type RemoveContributorFormProps = {
    projectId: string
    userId: string
    // Used in the accessible name of the button ("Retirer Alice Dupont")
    displayName: string
}

// "Retirer" button of one contributor. Its own form: the modal already contains the project form,
// and a <form> cannot be placed inside another <form>.
const RemoveContributorForm = ({ projectId, userId, displayName }: RemoveContributorFormProps) => {
    const [state, formAction, isPending] = useActionState(removeContributorAction, initialState)

    return (
        <form action={formAction} className="flex flex-col items-end gap-1">
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="userId" value={userId} />
            <button
                type="submit"
                disabled={isPending}
                aria-label={`Retirer ${displayName}`}
                className="cursor-pointer text-xs text-neutral-grey-800 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange disabled:cursor-not-allowed disabled:opacity-50"
            >
                Retirer
            </button>
            {state.message && <p role="alert" className="text-xs text-red-500">{state.message}</p>}
        </form>
    )
}

export default RemoveContributorForm
