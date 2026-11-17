'use client'

import { useActionState, useEffect, useState } from 'react'
import type { TaskFormState } from '@/app/actions/tasks'
import Button from '@/components/ui/Button'
import TextField from '@/components/ui/TextField'
import { isBlank } from '@/lib/forms/isBlank'
import { STATUS_CLASSES, STATUS_LABELS } from '@/lib/tasks/labels'
import { getDisplayName } from '@/lib/users/displayName'
import type { TaskStatus, UserSummary } from '@/types'

const initialState: TaskFormState = { message: null, success: false }

// The statuses offered in the form (a cancelled task makes no sense when creating or editing)
const FORM_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']

// Values the form starts with: empty when creating a task, the task's own values when editing it
export type TaskFormValues = {
    title: string
    description: string
    // Format of the date input: "2026-11-10"
    dueDate: string
    assigneeIds: string[]
    status: TaskStatus
}

const EMPTY_VALUES: TaskFormValues = { title: '', description: '', dueDate: '', assigneeIds: [], status: 'TODO' }

type TaskFormProps = {
    // The Server Action to run on submit (createTaskAction or updateTaskAction)
    action: (previousState: TaskFormState, formData: FormData) => Promise<TaskFormState>
    projectId: string
    // Set only when editing: the task to update
    taskId?: string
    // The people the task can be assigned to: the members of the project
    people: UserSummary[]
    initialValues?: TaskFormValues
    submitLabel: string
    // Called once the action worked, so the modal can close
    onSuccess: () => void
}

// Form shared by the "Créer une tâche" and "Modifier" modals. Client component: it holds the typed values
// and the pending/error state.
const TaskForm = ({ action, projectId, taskId, people, initialValues = EMPTY_VALUES, submitLabel, onSuccess }: TaskFormProps) => {
    const [state, formAction, isPending] = useActionState(action, initialState)
    const [title, setTitle] = useState<string>(initialValues.title)
    const [description, setDescription] = useState<string>(initialValues.description)
    const [dueDate, setDueDate] = useState<string>(initialValues.dueDate)
    // The fields marked with * must be filled. When editing, the fields start filled, so the button starts enabled.
    const canSubmit = !isBlank(title) && !isBlank(description) && !isBlank(dueDate)

    // Tell the modal to close when the Server Action reports a success
    useEffect(() => {
        if (state.success) onSuccess()
    }, [state.success, onSuccess])

    return (
        <form action={formAction} className="flex w-full flex-col items-start gap-6">
            <input type="hidden" name="projectId" value={projectId} />
            {taskId && <input type="hidden" name="taskId" value={taskId} />}
            <TextField label="Titre*" name="title" type="text" value={title} onChange={setTitle} />
            <TextField label="Description*" name="description" type="text" value={description} onChange={setDescription} />
            <TextField label="Échéance*" name="dueDate" type="date" value={dueDate} onChange={setDueDate} />

            {/* Checkboxes sharing the same name: the action reads them all with formData.getAll('assigneeIds') */}
            <fieldset className="flex w-full flex-col gap-2">
                <legend className="mb-2 text-sm text-black">Assigné à :</legend>
                {people.map(person => (
                    <label key={person.id} className="flex items-center gap-3 text-sm text-neutral-grey-950">
                        <input
                            type="checkbox"
                            name="assigneeIds"
                            value={person.id}
                            defaultChecked={initialValues.assigneeIds.includes(person.id)}
                            className="size-4 accent-brand-dark-orange"
                        />
                        {getDisplayName(person)}
                    </label>
                ))}
            </fieldset>

            {/* Radio buttons shown as the status badges of the mockup */}
            <fieldset className="flex flex-col gap-3">
                <legend className="mb-3 text-sm text-black">Statut :</legend>
                <div className="flex flex-wrap gap-2">
                    {FORM_STATUSES.map(status => (
                        <label key={status} className="cursor-pointer">
                            <input type="radio" name="status" value={status} defaultChecked={status === initialValues.status} className="peer sr-only" />
                            <span className={`block rounded-full px-4 py-1 text-sm peer-checked:ring-2 peer-checked:ring-current peer-focus-visible:ring-2 peer-focus-visible:ring-brand-dark-orange ${STATUS_CLASSES[status]}`}>
                                {STATUS_LABELS[status]}
                            </span>
                        </label>
                    ))}
                </div>
            </fieldset>

            {state.message && <p role="alert" className="text-red-500">{state.message}</p>}
            <Button label={submitLabel} type="submit" disabled={isPending || !canSubmit} />
        </form>
    )
}

export default TaskForm
