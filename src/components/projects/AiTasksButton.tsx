'use client'

import { useState } from 'react'
import ModalDialog from '@/components/ui/ModalDialog'

// "IA" button of the project page (orange, with a sparkle) and the modal it opens.
// The generation itself is not built yet: the modal only says so, instead of a button that does nothing.
const AiTasksButton = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="flex cursor-pointer items-center gap-2 rounded-[6px] bg-brand-dark-orange px-6 py-3.5 text-base text-neutral-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-grey-950"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z" />
                </svg>
                IA
            </button>
            <ModalDialog isOpen={isOpen} onClose={() => setIsOpen(false)} title="Générer des tâches avec l'IA">
                <p className="text-base text-neutral-grey-950">Cette fonctionnalité sera bientôt disponible.</p>
            </ModalDialog>
        </>
    )
}

export default AiTasksButton
