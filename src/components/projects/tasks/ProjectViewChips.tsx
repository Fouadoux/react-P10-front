import Image from 'next/image'
import type { ProjectView } from '@/lib/projects/view'

const chipClassName =
    'flex cursor-pointer items-center gap-2 rounded-[8px] px-4 py-[14px] text-sm leading-[17px] text-brand-dark-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange'

type ProjectViewChipsProps = {
    // The view currently on screen
    view: ProjectView
    // Called with the view the user clicked on
    onChange: (view: ProjectView) => void
}

// "Liste / Calendrier" chips of the task panel, as in the mockup.
// Two toggle buttons: `aria-pressed` tells screen readers which view is on.
const ProjectViewChips = ({ view, onChange }: ProjectViewChipsProps) => (
    <div role="group" aria-label="Affichage des tâches" className="flex gap-2.5">
        <button
            type="button"
            aria-pressed={view === 'list'}
            onClick={() => onChange('list')}
            className={`${chipClassName} ${view === 'list' ? 'bg-brand-light-orange' : 'bg-neutral-white'}`}
        >
            <Image src="/icons/icon-list-orange.svg" alt="" width={16} height={16} />
            Liste
        </button>
        <button
            type="button"
            aria-pressed={view === 'calendar'}
            onClick={() => onChange('calendar')}
            className={`${chipClassName} ${view === 'calendar' ? 'bg-brand-light-orange' : 'bg-neutral-white'}`}
        >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="3" width="12" height="11" rx="2" />
                <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" />
            </svg>
            Calendrier
        </button>
    </div>
)

export default ProjectViewChips
