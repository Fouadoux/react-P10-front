import Image from 'next/image'

const chipClassName = 'flex items-center gap-2 rounded-[6px] px-4 py-3 text-sm text-brand-dark-orange'

// "Liste / Calendrier" chips of the task panel, as in the mockup.
// Only the list exists for now: "Liste" is the view already on screen, and "Calendrier" is disabled
// (a native `disabled` button is skipped by the keyboard and announced as unavailable by screen readers).
const ProjectViewChips = () => (
    <div role="group" aria-label="Affichage des tâches" className="flex gap-2.5">
        <button
            type="button"
            aria-pressed="true"
            className={`${chipClassName} cursor-pointer bg-brand-light-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange`}
        >
            <Image src="/icons/icon-list-orange.svg" alt="" width={16} height={16} />
            Liste
        </button>
        <button type="button" disabled className={`${chipClassName} cursor-not-allowed bg-neutral-white`}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="3" width="12" height="11" rx="2" />
                <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" />
            </svg>
            Calendrier
        </button>
    </div>
)

export default ProjectViewChips
