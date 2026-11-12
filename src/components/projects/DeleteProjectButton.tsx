'use client'

import { useState } from 'react'
import DeleteProjectModal from '@/components/projects/DeleteProjectModal'
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
                className="cursor-pointer rounded-[6px] border border-red-700 bg-neutral-white px-6 py-3.5 text-base text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange"
            >
                Supprimer le projet
            </button>
            <DeleteProjectModal project={project} isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}

export default DeleteProjectButton
