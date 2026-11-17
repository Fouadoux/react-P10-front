'use client'

import { useActionState, useEffect } from 'react'
import { deleteTaskAction, type TaskFormState } from '@/app/actions/tasks'
import Button from '@/components/ui/Button'
import ModalDialog from '@/components/ui/ModalDialog'
import type { ProjectTask } from '@/types'

const initialState: TaskFormState = { message: null, success: false }

type DeleteTaskFormProps = {
    task: ProjectTask
    onClose: () => void
}

// The confirmation itself. It is a separate component so that its state starts fresh every time the modal opens.
const DeleteTaskForm = ({ task, onClose }: DeleteTaskFormProps) => {
    const [state, formAction, isPending] = useActionState(deleteTaskAction, initialState)

    useEffect(() => {
        if (state.success) onClose()
    }, [state.success, onClose])

    return (
        <form action={formAction} className="flex flex-col items-start gap-6">
            <input type="hidden" name="projectId" value={task.projectId} />
            <input type="hidden" name="taskId" value={task.id} />
            <p className="text-base text-neutral-grey-950">
                Voulez-vous vraiment supprimer la tâche « {task.title} » ? Cette action est définitive.
            </p>
            {state.message && <p role="alert" className="text-red-500">{state.message}</p>}
            <div className="flex flex-wrap gap-4">
                <Button label="Annuler" onClick={onClose} />
                <Button label="Supprimer" type="submit" disabled={isPending} />
            </div>
        </form>
    )
}

type DeleteTaskModalProps = {
    task: ProjectTask
    isOpen: boolean
    onClose: () => void
}

// "Supprimer" confirmation modal of a task
const DeleteTaskModal = ({ task, isOpen, onClose }: DeleteTaskModalProps) => (
    <ModalDialog isOpen={isOpen} onClose={onClose} title="Supprimer la tâche">
        <DeleteTaskForm task={task} onClose={onClose} />
    </ModalDialog>
)

export default DeleteTaskModal
