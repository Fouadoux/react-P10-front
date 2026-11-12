'use client'

import { useActionState, useEffect, useState } from 'react'
import { updateProjectAction, type CreateProjectState } from '@/app/actions/projects'
import Button from '@/components/ui/Button'
import TextField from '@/components/ui/TextField'
import { isBlank } from '@/lib/forms/isBlank'
import type { Project } from '@/types'

const initialState: CreateProjectState = { message: null, success: false }

type EditProjectFormProps = {
    project: Project
    // Called once the project is saved, so the modal can close
    onSuccess: () => void
}

// Form of the "Modifier un projet" modal: name and description, filled with the current values.
// The contributors are managed separately (they have their own routes on the backend).
const EditProjectForm = ({ project, onSuccess }: EditProjectFormProps) => {
    const [state, formAction, isPending] = useActionState(updateProjectAction, initialState)
    const [name, setName] = useState<string>(project.name)
    const [description, setDescription] = useState<string>(project.description ?? '')
    // The fields marked with * must be filled (a project without a description counts as empty here too)
    const canSubmit = !isBlank(name) && !isBlank(description)

    useEffect(() => {
        if (state.success) onSuccess()
    }, [state.success, onSuccess])

    return (
        <form action={formAction} className="flex w-full flex-col items-start gap-6">
            <input type="hidden" name="projectId" value={project.id} />
            <TextField label="Titre*" name="name" type="text" value={name} onChange={setName} />
            <TextField label="Description*" name="description" type="text" value={description} onChange={setDescription} />
            {state.message && <p role="alert" className="text-red-500">{state.message}</p>}
            <Button label="Enregistrer" type="submit" disabled={isPending || !canSubmit} />
        </form>
    )
}

export default EditProjectForm
