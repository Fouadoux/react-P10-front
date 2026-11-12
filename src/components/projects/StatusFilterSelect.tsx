'use client'

import Image from 'next/image'
import { STATUS_LABELS } from '@/lib/tasks/labels'
import type { StatusFilter } from '@/lib/tasks/search'
import type { TaskStatus } from '@/types'

type StatusFilterSelectProps = {
    value: StatusFilter
    onChange: (value: StatusFilter) => void
}

// Dropdown "Statut" of the task panel. A native <select>: keyboard and screen readers work out of the box.
// `appearance-none` hides the browser's own arrow, which is replaced by the mockup's arrow drawn on top
// (`pointer-events-none`: a click on the arrow still reaches the <select> underneath).
const StatusFilterSelect = ({ value, onChange }: StatusFilterSelectProps) => (
    <label className="relative flex w-full max-w-[152px] flex-col">
        <span className="sr-only">Filtrer par statut</span>
        <select
            value={value}
            // The browser gives a plain string: it can only be one of the option values below
            onChange={event => onChange(event.target.value as StatusFilter)}
            className="h-[63px] w-full cursor-pointer appearance-none rounded-[10px] border border-neutral-grey-200 bg-neutral-white pl-6 pr-12 text-sm text-neutral-grey-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange"
        >
            <option value="ALL">Statut</option>
            {(Object.keys(STATUS_LABELS) as TaskStatus[]).map(status => (
                <option key={status} value={status}>{STATUS_LABELS[status]}</option>
            ))}
        </select>
        <Image src="/icons/icon-chevron-down-grey.svg" alt="" width={17} height={10} className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2" />
    </label>
)

export default StatusFilterSelect
