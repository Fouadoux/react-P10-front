'use client'

import Image from 'next/image'

type TaskSearchProps = {
    // Text currently typed in the box
    value: string
    // Called with the new text each time the user types a letter
    onChange: (value: string) => void
}

// Search box of the task list: it only displays what it receives and reports each keystroke
const TaskSearch = ({ value, onChange }: TaskSearchProps) => (
    <div role="search" className="flex w-full max-w-[357px] items-center rounded-[10px] border border-neutral-grey-200 bg-neutral-white px-8 py-5">
        <label htmlFor="task-search" className="sr-only">Rechercher une tâche</label>
        <input
            id="task-search"
            type="search"
            value={value}
            onChange={event => onChange(event.target.value)}
            placeholder="Rechercher une tâche"
            className="w-full bg-transparent text-sm text-neutral-grey-950 placeholder:text-neutral-grey-500 focus-visible:outline-none"
        />
        <Image src="/icons/icon-search-grey.svg" alt="" width={14} height={14} />
    </div>
)

export default TaskSearch
