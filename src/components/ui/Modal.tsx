'use client'

import { useCallback, useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from 'react'

type ModalProps = {
    // Text of the button that opens the modal
    triggerLabel: string
    // Heading shown at the top of the modal (also its accessible name)
    title: string
    // The content, given a function that closes the modal. It is only mounted while the modal is open,
    // so a form inside always starts empty.
    children: (close: () => void) => ReactNode
}

// Button + modal window, built on the native <dialog> element: the browser itself keeps the focus
// inside the window, closes it with the Escape key and dims the page.
const Modal = ({ triggerLabel, title, children }: ModalProps) => {
    const titleId = useId()
    const dialogRef = useRef<HTMLDialogElement>(null)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    // The state is the single source of truth: this effect makes the <dialog> follow it
    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return
        if (isOpen && !dialog.open) dialog.showModal()
        if (!isOpen && dialog.open) dialog.close()
    }, [isOpen])

    const open = () => setIsOpen(true)
    const close = useCallback(() => setIsOpen(false), [])

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
                {triggerLabel}
            </button>
            <dialog
                ref={dialogRef}
                aria-labelledby={titleId}
                // "close" is fired for every way of closing: Escape, the cross, the backdrop, or close() after a success
                onClose={() => setIsOpen(false)}
                onClick={closeOnBackdropClick}
                className="m-auto max-h-[calc(100vh-2rem)] w-[598px] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-[10px] bg-neutral-white p-0 backdrop:bg-black/50"
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
                    <h2 id={titleId} className="text-2xl text-neutral-grey-950">{title}</h2>
                    {isOpen && children(close)}
                </div>
            </dialog>
        </>
    )
}

export default Modal
