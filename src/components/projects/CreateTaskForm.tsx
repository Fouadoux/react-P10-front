'use client'

import { useActionState, useEffect, useState } from 'react'
import { createTaskAction, type CreateTaskState } from '@/app/actions/tasks'
import Button from '@/components/ui/Button'
import TextField from '@/components/ui/TextField'
import { STATUS_CLASSES, STATUS_LABELS } from '@/lib/tasks/labels'
import { getDisplayName } from '@/lib/users/displayName'
import type { TaskStatus, UserSummary } from '@/types'

const initialState: CreateTaskState = { message: null, success: false }

// The statuses offered when creating a task (a cancelled task makes no sense at creation)
const CREATION_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']

type CreateTaskFormProps = {
    projectId: string
    // The people the task can be assigned to: the members of the project
    people: UserSummary[]
    // Called once the task is created, so the modal can close
    onSuccess: () => void
}

// Form of the "Créer une tâche" modal. Client component: it holds the typed values and the pending/error state.
const CreateTaskForm = ({ projectId, people, onSuccess }: CreateTaskFormProps) => {
    const [state, formAction, isPending] = useActionState(createTaskAction, initialState)
    const [title, setTitle] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [dueDate, setDueDate] = useState<string>('')

    // Tell the modal to close when the Server Action reports a success
    useEffect(() => {
        if (state.success) onSuccess()
    }, [state.success, onSuccess])

    return (
        <form action={formAction} className="flex w-full flex-col items-start gap-6">
            <input type="hidden" name="projectId" value={projectId} />
            <TextField label="Titre*" name="title" type="text" value={title} onChange={setTitle} />
            <TextField label="Description*" name="description" type="text" value={description} onChange={setDescription} />
            <TextField label="Échéance*" name="dueDate" type="date" value={dueDate} onChange={setDueDate} />

            {/* Checkboxes sharing the same name: the action reads them all with formData.getAll('assigneeIds') */}
            <fieldset className="flex w-full flex-col gap-2">
                <legend className="mb-2 text-sm text-black">Assigné à :</legend>
                {people.map(person => (
                    <label key={person.id} className="flex items-center gap-3 text-sm text-neutral-grey-950">
                        <input type="checkbox" name="assigneeIds" value={person.id} className="size-4 accent-brand-dark-orange" />
                        {getDisplayName(person)}
                    </label>
                ))}
            </fieldset>

            {/* Radio buttons shown as the status badges of the mockup */}
            <fieldset className="flex flex-col gap-3">
                <legend className="mb-3 text-sm text-black">Statut :</legend>
                <div className="flex flex-wrap gap-2">
                    {CREATION_STATUSES.map(status => (
                        <label key={status} className="cursor-pointer">
                            <input type="radio" name="status" value={status} defaultChecked={status === 'TODO'} className="peer sr-only" />
                            <span className={`block rounded-full px-4 py-1 text-sm peer-checked:ring-2 peer-checked:ring-current peer-focus-visible:ring-2 peer-focus-visible:ring-brand-dark-orange ${STATUS_CLASSES[status]}`}>
                                {STATUS_LABELS[status]}
                            </span>
                        </label>
                    ))}
                </div>
            </fieldset>

            {state.message && <p role="alert" className="text-red-500">{state.message}</p>}
            <Button label="+ Ajouter une tâche" type="submit" disabled={isPending} />
        </form>
    )
}

export default CreateTaskForm
