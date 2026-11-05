'use client'

import { useCallback, useState, type ReactNode } from 'react'
import ModalDialog from '@/components/ui/ModalDialog'

type ModalProps = {
    // Text of the button that opens the modal
    triggerLabel: string
    // Heading shown at the top of the modal
    title: string
    // The content, given a function that closes the modal
    children: (close: () => void) => ReactNode
}

// A button and the modal window it opens
const Modal = ({ triggerLabel, title, children }: ModalProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const close = useCallback(() => setIsOpen(false), [])

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="cursor-pointer rounded-[6px] bg-neutral-grey-950 px-6 py-3.5 text-base text-neutral-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange"
            >
                {triggerLabel}
            </button>
            <ModalDialog isOpen={isOpen} onClose={close} title={title}>
                {children(close)}
            </ModalDialog>
        </>
    )
}

export default Modal
