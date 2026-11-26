'use client'

import { useActionState, useEffect, useId, useState, type ReactNode } from 'react'
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
    // Shown between the fields and the button (the contributors, which have their own forms and routes)
    children?: ReactNode
}

// Form of the "Modifier un projet" modal: name and description, filled with the current values.
// The mockup puts the contributors between the fields and the button. Their forms cannot sit inside this <form>
// (a <form> inside a <form> is not valid HTML): the button is placed after them and linked to the form by its id.
const EditProjectForm = ({ project, onSuccess, children }: EditProjectFormProps) => {
    const [state, formAction, isPending] = useActionState(updateProjectAction, initialState)
    const [name, setName] = useState<string>(project.name)
    const [description, setDescription] = useState<string>(project.description ?? '')
    const formId = useId()
    // The fields marked with * must be filled (a project without a description counts as empty here too)
    const canSubmit = !isBlank(name) && !isBlank(description)

    useEffect(() => {
        if (state.success) onSuccess()
    }, [state.success, onSuccess])

    return (
        <div className="flex w-full flex-col items-start gap-6">
            <form id={formId} action={formAction} className="flex w-full flex-col items-start gap-6">
                <input type="hidden" name="projectId" value={project.id} />
                <TextField label="Titre*" name="name" type="text" value={name} onChange={setName} mutedValue />
                <TextField label="Description*" name="description" type="text" value={description} onChange={setDescription} mutedValue />
            </form>
            {children}
            {state.message && <p role="alert" className="text-red-500">{state.message}</p>}
            <Button label="Enregistrer" type="submit" form={formId} disabled={isPending || !canSubmit} widthClassName="w-[181px]" />
        </div>
    )
}

export default EditProjectForm
