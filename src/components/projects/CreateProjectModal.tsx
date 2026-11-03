'use client'

import { useCallback, useRef, useState, type MouseEvent } from 'react'
import CreateProjectForm from '@/components/projects/CreateProjectForm'

// "+ Créer un projet" button and the modal it opens. Built on the native <dialog> element:
// the browser itself keeps the focus inside the window, closes it with the Escape key and dims the page.
const CreateProjectModal = () => {
    const dialogRef = useRef<HTMLDialogElement>(null)
    // The form is only mounted while the modal is open, so it starts empty every time
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const open = () => {
        setIsOpen(true)
        dialogRef.current?.showModal()
    }

    const close = useCallback(() => {
        dialogRef.current?.close()
    }, [])

    // A click on the dimmed area lands on the <dialog> itself (the white card is an inner element)
    const closeOnBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
        if (event.target === event.currentTarget) close()
    }

    return (
        <>
            <button
                type="button"
                onClick={open}
                className="cursor-pointer rounded-[6px] bg-neutral-grey-950 px-6 py-3.5 text-base text-neutral-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange"
            >
                + Créer un projet
            </button>
            <dialog
                ref={dialogRef}
                aria-labelledby="create-project-title"
                // "close" is fired for every way of closing: Escape, the cross, the backdrop, or close() after a success
                onClose={() => setIsOpen(false)}
                onClick={closeOnBackdropClick}
                className="m-auto w-[598px] max-w-[calc(100vw-2rem)] rounded-[10px] bg-neutral-white p-0 backdrop:bg-black/50"
            >
                <div className="relative flex flex-col gap-10 px-6 py-16 sm:px-[73px] sm:py-[79px]">
                    <button
                        type="button"
                        onClick={close}
                        aria-label="Fermer la fenêtre"
                        className="absolute right-8 top-8 flex size-8 cursor-pointer items-center justify-center rounded-full text-neutral-grey-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                            <path d="M2 2l12 12M14 2L2 14" />
                        </svg>
                    </button>
                    <h2 id="create-project-title" className="text-2xl text-neutral-grey-950">Créer un projet</h2>
                    {isOpen && <CreateProjectForm onSuccess={close} />}
                </div>
            </dialog>
        </>
    )
}

export default CreateProjectModal
