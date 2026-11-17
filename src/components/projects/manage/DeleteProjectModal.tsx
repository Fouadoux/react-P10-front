'use client'

import { useActionState } from 'react'
import { deleteProjectAction, type CreateProjectState } from '@/app/actions/projects'
import Button from '@/components/ui/Button'
import ModalDialog from '@/components/ui/ModalDialog'
import type { Project } from '@/types'

const initialState: CreateProjectState = { message: null, success: false }

type DeleteProjectFormProps = {
    project: Project
    onClose: () => void
}

// The confirmation itself. It is a separate component so that its state starts fresh every time the modal opens.
const DeleteProjectForm = ({ project, onClose }: DeleteProjectFormProps) => {
    const [state, formAction, isPending] = useActionState(deleteProjectAction, initialState)

    return (
        <form action={formAction} className="flex flex-col items-start gap-6">
            <input type="hidden" name="projectId" value={project.id} />
            <div className="flex flex-col gap-3 text-base text-neutral-grey-950">
                <p>Voulez-vous vraiment supprimer le projet « {project.name} » ?</p>
                <p>Toutes ses tâches et leurs commentaires seront aussi supprimés. Cette action est définitive.</p>
            </div>
            {state.message && <p role="alert" className="text-red-500">{state.message}</p>}
            <div className="flex flex-wrap gap-4">
                <Button label="Annuler" onClick={onClose} />
                <Button label="Supprimer" type="submit" disabled={isPending} />
            </div>
        </form>
    )
}

type DeleteProjectModalProps = {
    project: Project
    isOpen: boolean
    onClose: () => void
}

// "Supprimer" confirmation modal of a project
const DeleteProjectModal = ({ project, isOpen, onClose }: DeleteProjectModalProps) => (
    <ModalDialog isOpen={isOpen} onClose={onClose} title="Supprimer le projet">
        <DeleteProjectForm project={project} onClose={onClose} />
    </ModalDialog>
)

export default DeleteProjectModal
