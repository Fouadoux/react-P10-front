'use client'

import { STATUS_LABELS } from '@/lib/tasks/labels'
import type { StatusFilter } from '@/lib/tasks/search'
import type { TaskStatus } from '@/types'

type StatusFilterSelectProps = {
    value: StatusFilter
    onChange: (value: StatusFilter) => void
}

// Dropdown "Statut" of the task panel. A native <select>: keyboard and screen readers work out of the box.
const StatusFilterSelect = ({ value, onChange }: StatusFilterSelectProps) => (
    <label className="flex w-full max-w-[152px] flex-col">
        <span className="sr-only">Filtrer par statut</span>
        <select
            value={value}
            // The browser gives a plain string: it can only be one of the option values below
            onChange={event => onChange(event.target.value as StatusFilter)}
            className="h-[63px] w-full cursor-pointer rounded-[10px] border border-neutral-grey-200 bg-neutral-white px-6 text-sm text-neutral-grey-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange"
        >
            <option value="ALL">Statut</option>
            {(Object.keys(STATUS_LABELS) as TaskStatus[]).map(status => (
                <option key={status} value={status}>{STATUS_LABELS[status]}</option>
            ))}
        </select>
    </label>
)

export default StatusFilterSelect
