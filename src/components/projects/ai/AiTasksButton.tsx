'use client'

import { useState } from 'react'
import AiTasksPanel from '@/components/projects/ai/AiTasksPanel'
import ModalDialog from '@/components/ui/ModalDialog'

type AiTasksButtonProps = {
    projectId: string
}

// "IA" button of the project page (orange, with a sparkle) and the modal it opens.
// 'use client' because it holds a state (is the modal open?) and reacts to a click.
const AiTasksButton = ({ projectId }: AiTasksButtonProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    // The mockup renames the modal "Vos tâches..." once the list of generated tasks is on screen
    const [hasTasks, setHasTasks] = useState<boolean>(false)

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="flex h-[50px] cursor-pointer items-center gap-2 rounded-[10px] bg-brand-dark-orange px-6 text-base text-neutral-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-grey-950"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z" />
                </svg>
                IA
            </button>
            <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)} title={hasTasks ? 'Vos tâches...' : 'Créer une tâche'}>
                <AiTasksPanel projectId={projectId} onClose={() => setIsOpen(false)} onHasTasksChange={setHasTasks} />
            </ModalDialog>
        </>
    )
}

export default AiTasksButton
