'use client'

import { useCallback, useState } from 'react'
import DeleteTaskModal from '@/components/projects/DeleteTaskModal'
import EditTaskModal from '@/components/projects/EditTaskModal'
import type { ProjectTask, UserSummary } from '@/types'

type TaskMenuProps = {
    task: ProjectTask
    people: UserSummary[]
}

const menuItemClass = 'w-full cursor-pointer px-4 py-2 text-left text-sm text-neutral-grey-950 hover:bg-neutral-grey-50 focus-visible:bg-neutral-grey-50 focus-visible:outline-none'

// The "…" button of a task card: a small menu with "Modifier" and "Supprimer", each opening its modal
const TaskMenu = ({ task, people }: TaskMenuProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    // Which modal is open (only one at a time), or none
    const [openModal, setOpenModal] = useState<'edit' | 'delete' | null>(null)
    const closeModal = useCallback(() => setOpenModal(null), [])

    const choose = (modal: 'edit' | 'delete') => {
        setIsMenuOpen(false)
        setOpenModal(modal)
    }

    return (
        <div className="relative">
            <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
                aria-label={`Actions pour la tâche ${task.title}`}
                onClick={() => setIsMenuOpen(previous => !previous)}
                className="flex size-14 cursor-pointer items-center justify-center rounded-[10px] border border-neutral-grey-200 bg-neutral-white text-neutral-grey-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange"
            >
                <svg width="16" height="4" viewBox="0 0 16 4" fill="currentColor" aria-hidden="true">
                    <circle cx="2" cy="2" r="1.5" />
                    <circle cx="8" cy="2" r="1.5" />
                    <circle cx="14" cy="2" r="1.5" />
                </svg>
            </button>
            {isMenuOpen && (
                <div role="menu" className="absolute right-0 top-full z-10 mt-2 w-40 rounded-[10px] border border-neutral-grey-200 bg-neutral-white py-2 shadow-[0px_4px_12px_1px_rgba(0,0,0,0.08)]">
                    <button type="button" role="menuitem" onClick={() => choose('edit')} className={menuItemClass}>Modifier</button>
                    <button type="button" role="menuitem" onClick={() => choose('delete')} className={menuItemClass}>Supprimer</button>
                </div>
            )}
            <EditTaskModal task={task} people={people} isOpen={openModal === 'edit'} onClose={closeModal} />
            <DeleteTaskModal task={task} isOpen={openModal === 'delete'} onClose={closeModal} />
        </div>
    )
}

export default TaskMenu
