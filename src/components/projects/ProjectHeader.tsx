import Link from 'next/link'
import type { Project } from '@/types'

type ProjectHeaderProps = {
    project: Project
}

// Top of the project page: back button, name and description
const ProjectHeader = ({ project }: ProjectHeaderProps) => (
    <header className="flex items-start gap-4">
        <Link
            href="/projects"
            aria-label="Retour aux projets"
            className="flex size-14 shrink-0 items-center justify-center rounded-[10px] border border-neutral-grey-200 bg-neutral-white text-neutral-grey-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange"
        >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M14 8H2M7 3L2 8l5 5" />
            </svg>
        </Link>
        <div className="flex flex-col gap-3">
            <h1 className="font-heading text-2xl font-semibold text-neutral-grey-950">{project.name}</h1>
            {project.description && <p className="text-base text-neutral-grey-800">{project.description}</p>}
        </div>
    </header>
)

export default ProjectHeader
