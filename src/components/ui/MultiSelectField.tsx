'use client'

import Image from 'next/image'
import { useId, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react'

export type MultiSelectOption = {
    id: string
    label: string
}

type MultiSelectFieldProps = {
    // Text above the field ("Assigné à :")
    label: string
    // Name of the hidden inputs sent with the form: one per selected option, all with the same name
    // (the Server Action reads them with formData.getAll(name))
    name: string
    options: MultiSelectOption[]
    selectedIds: string[]
    onChange: (selectedIds: string[]) => void
    // Shown while nothing is selected
    placeholder: string
}

// Dropdown that lets the user tick several options, as in the mockup ("Choisir un ou plusieurs collaborateurs").
// A button opens a panel of native checkboxes: the keyboard (Tab, Space) and screen readers work out of the box.
// The selection lives in the parent (selectedIds / onChange); the hidden inputs carry it to the form.
const MultiSelectField = ({ label, name, options, selectedIds, onChange, placeholder }: MultiSelectFieldProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const labelId = useId()
    const summaryId = useId()
    const panelId = useId()
    const buttonRef = useRef<HTMLButtonElement>(null)

    const selectedOptions = options.filter(option => selectedIds.includes(option.id))
    const summary =
        selectedOptions.length === 0 ? placeholder
            : selectedOptions.length === 1 ? selectedOptions[0].label
                : `${selectedOptions.length} collaborateurs`

    const toggle = (id: string) =>
        onChange(selectedIds.includes(id) ? selectedIds.filter(selectedId => selectedId !== id) : [...selectedIds, id])

    // Close the panel when the focus goes somewhere else (Tab out, click elsewhere)
    const closeWhenFocusLeaves = (event: FocusEvent<HTMLDivElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false)
    }

    // Escape closes the panel only: without this, the <dialog> around the form would close with it
    const closeOnEscape = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key !== 'Escape' || !isOpen) return
        event.preventDefault()
        event.stopPropagation()
        setIsOpen(false)
        buttonRef.current?.focus()
    }

    return (
        <div className="relative flex w-full flex-col gap-[5px]" onBlur={closeWhenFocusLeaves} onKeyDown={closeOnEscape}>
            <span id={labelId} className="text-sm text-black">{label}</span>
            {selectedIds.map(id => <input key={id} type="hidden" name={name} value={id} />)}
            <button
                ref={buttonRef}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-labelledby={`${labelId} ${summaryId}`}
                onClick={() => setIsOpen(open => !open)}
                className="flex h-[53px] w-full cursor-pointer items-center justify-between rounded-[4px] border border-neutral-grey-200 bg-neutral-white px-[17px] text-left text-xs text-neutral-grey-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange"
            >
                <span id={summaryId}>{summary}</span>
                <Image
                    src="/icons/icon-chevron-down-grey.svg"
                    alt=""
                    width={17}
                    height={10}
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            {isOpen && (
                <div
                    id={panelId}
                    role="group"
                    aria-labelledby={labelId}
                    // A click on the text of a row (not on a focusable element) would move the focus out of the field:
                    // the panel would close before the click ticks the box. Keeping the focus where it is fixes that.
                    onMouseDown={event => event.preventDefault()}
                    className="absolute left-0 top-full z-10 mt-1 flex max-h-60 w-full flex-col gap-1 overflow-y-auto rounded-[4px] border border-neutral-grey-200 bg-neutral-white p-2 shadow-md"
                >
                    {options.map(option => (
                        <label key={option.id} className="flex cursor-pointer items-center gap-3 rounded-[4px] px-2 py-2 text-sm text-neutral-grey-950 hover:bg-neutral-grey-50">
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(option.id)}
                                onChange={() => toggle(option.id)}
                                className="size-4 accent-brand-dark-orange"
                            />
                            {option.label}
                        </label>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MultiSelectField
