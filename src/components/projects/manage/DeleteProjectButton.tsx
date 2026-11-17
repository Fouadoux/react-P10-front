'use client'

import { useState } from 'react'
import DeleteProjectModal from '@/components/projects/manage/DeleteProjectModal'
import type { Project } from '@/types'

type DeleteProjectButtonProps = {
    project: Project
}

// "Supprimer" button of the project page and the confirmation modal it opens.
// 'use client' because it holds a state (is the modal open?) and reacts to a click.
const DeleteProjectButton = ({ project }: DeleteProjectButtonProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                // Starts with the visible word (WCAG 2.5.3) and says what is deleted: several "Supprimer" can coexist on the page
                aria-label="Supprimer le projet"
                className="cursor-pointer text-sm text-red-700 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange"
            >
                Supprimer
            </button>
            <DeleteProjectModal project={project} isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}

export default DeleteProjectButton
