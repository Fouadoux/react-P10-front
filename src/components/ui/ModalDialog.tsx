'use client'

import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from 'react'

type ModalDialogProps = {
    isOpen: boolean
    // Called for every way of closing: the cross, a click on the backdrop, the Escape key
    onClose: () => void
    // Heading shown at the top of the window (also its accessible name)
    title: string
    // Only mounted while the window is open, so a form inside always starts fresh
    children: ReactNode
}

// A modal window built on the native <dialog> element: the browser itself keeps the focus
// inside the window, closes it with the Escape key and dims the page.
// The parent owns the "open" state: this component only follows it.
const ModalDialog = ({ isOpen, onClose, title, children }: ModalDialogProps) => {
    const titleId = useId()
    const dialogRef = useRef<HTMLDialogElement>(null)

    // The state is the single source of truth: this effect makes the <dialog> follow it
    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return
        if (isOpen && !dialog.open) dialog.showModal()
        if (!isOpen && dialog.open) dialog.close()
    }, [isOpen])

    // A click on the dimmed area lands on the <dialog> itself (the white card is an inner element)
    const closeOnBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
        if (event.target === event.currentTarget) onClose()
    }

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={titleId}
            // "close" is fired when the browser closes the dialog by itself (Escape)
            onClose={onClose}
            onClick={closeOnBackdropClick}
            className="m-auto max-h-[calc(100vh-2rem)] w-[598px] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-[10px] bg-neutral-white p-0 backdrop:bg-black/50"
        >
            <div className="relative flex flex-col gap-10 px-6 py-16 sm:px-[73px] sm:py-[79px]">
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Fermer la fenêtre"
                    className="absolute right-8 top-8 flex size-8 cursor-pointer items-center justify-center rounded-full text-neutral-grey-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                        <path d="M2 2l12 12M14 2L2 14" />
                    </svg>
                </button>
                <h2 id={titleId} className="text-2xl text-neutral-grey-950">{title}</h2>
                {isOpen && children}
            </div>
        </dialog>
    )
}

export default ModalDialog
