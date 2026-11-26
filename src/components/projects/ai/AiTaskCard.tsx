'use client'

import { useState } from 'react'
import TextField from '@/components/ui/TextField'
import type { DraftTask, GeneratedTask, GeneratedTaskStatus } from '@/lib/ai/schema'
import { isBlank } from '@/lib/forms/isBlank'
import { formatDueDate, STATUS_LABELS } from '@/lib/tasks/labels'

const STATUSES: GeneratedTaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE']

const linkButtonClass = 'flex cursor-pointer items-center gap-1 text-xs text-neutral-grey-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange'

type AiTaskCardProps = {
    task: DraftTask
    // Called with the fields that changed
    onChange: (patch: Partial<GeneratedTask>) => void
    onDelete: () => void
}

// One task of the review list: its text and a "Supprimer | Modifier" row, as in the mockup.
// "Modifier" swaps the text for the fields. A task without a title (just added by hand) starts in edit mode.
const AiTaskCard = ({ task, onChange, onDelete }: AiTaskCardProps) => {
    const [isEditing, setIsEditing] = useState<boolean>(isBlank(task.title))
    const label = isBlank(task.title) ? 'sans titre' : task.title

    return (
        <li className="flex flex-col gap-4 rounded-[10px] border border-neutral-grey-200 bg-neutral-white px-10 py-[25px]">
            {isEditing ? (
                <div className="flex flex-col gap-4">
                    <TextField label="Titre*" name="title" type="text" value={task.title} onChange={title => onChange({ title })} />
                    <TextField label="Description*" name="description" type="text" value={task.description} onChange={description => onChange({ description })} />
                    <TextField label="Échéance*" name="dueDate" type="date" value={task.dueDate} onChange={dueDate => onChange({ dueDate })} />
                    <label className="flex w-full flex-col gap-[7px] text-sm text-black">
                        Statut
                        <select
                            value={task.status}
                            onChange={event => onChange({ status: STATUSES.find(status => status === event.target.value) ?? 'TODO' })}
                            className="h-[53px] w-full rounded-[4px] border border-neutral-grey-200 bg-neutral-white px-[17px] focus:border-brand-dark-orange focus:outline-none focus:ring-1 focus:ring-brand-dark-orange"
                        >
                            {STATUSES.map(status => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}
                        </select>
                    </label>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <h3 className="font-heading text-lg font-semibold text-black">{task.title}</h3>
                    <p className="text-sm text-neutral-grey-500">{task.description}</p>
                    <p className="text-sm text-neutral-grey-800">
                        {STATUS_LABELS[task.status]}
                        {' · '}
                        {task.dueDate === ''
                            ? <span className="text-red-700">Échéance à renseigner</span>
                            : <>Échéance : {formatDueDate(task.dueDate)}</>}
                    </p>
                </div>
            )}
            <div className="flex items-center gap-3">
                <button type="button" onClick={onDelete} aria-label={`Supprimer la tâche ${label}`} className={linkButtonClass}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M2 4h12M6 4V2h4v2M4 4l1 10h6l1-10" />
                    </svg>
                    Supprimer
                </button>
                <span aria-hidden="true" className="h-4 w-px bg-neutral-grey-200" />
                <button
                    type="button"
                    onClick={() => setIsEditing(editing => !editing)}
                    aria-label={`${isEditing ? 'Terminer la modification de' : 'Modifier'} la tâche ${label}`}
                    aria-pressed={isEditing}
                    className={linkButtonClass}
                >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M11 2l3 3-8 8H3v-3z" />
                    </svg>
                    {isEditing ? 'Terminer' : 'Modifier'}
                </button>
            </div>
        </li>
    )
}

export default AiTaskCard
