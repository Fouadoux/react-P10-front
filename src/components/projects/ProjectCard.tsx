import Link from 'next/link'
import type { Project } from '@/types'
import { getInitials } from '@/lib/users/initials'

type ProjectCardProps = {
    project: Project;
    progress: { done: number; total: number; percent: number }
}

// A project of the "Mes projets" page: name, description, progress bar and team.
// Sizes come from the mockup: 380x351 card, 34px/30px padding, blocks spaced by 56px.
const ProjectCard = ({ project, progress }: ProjectCardProps) => {
    // The owner is shown first with a "Propriétaire" tag; the other members follow
    const otherMembers = project.members.filter(member => member.userId !== project.ownerId)

    return (
        <article className="relative flex min-h-[351px] flex-col justify-between gap-6 rounded-[10px] border border-neutral-grey-200 bg-neutral-white px-[34px] py-[30px]">
            <div className="flex flex-col gap-2">
                <h3 className="text-xl leading-[1.25] text-neutral-grey-950">
                    {/* Stretched link: the whole card is clickable, but only the title is read as a link */}
                    <Link
                        href={`/projects/${project.id}`}
                        className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-brand-dark-orange"
                    >
                        {project.name}
                    </Link>
                </h3>
                {project.description && <p className="line-clamp-2 text-xs leading-[17px] text-neutral-grey-800">{project.description}</p>}
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs leading-[15px] text-neutral-grey-800">
                    <span>Progression</span>
                    <span>{progress.percent}%</span>
                </div>
                <div className="flex flex-col gap-2">
                    <div
                        role="progressbar"
                        aria-label="Progression du projet"
                        aria-valuenow={progress.percent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        className="h-[7px] w-full overflow-hidden rounded-full bg-neutral-grey-200"
                    >
                        <div className="h-full rounded-full bg-brand-dark-orange" style={{ width: `${progress.percent}%` }} />
                    </div>
                    <p className="text-[10px] leading-3 text-neutral-grey-800">
                        {progress.done}/{progress.total} tâches terminées
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-[15px]">
                <p className="text-[10px] leading-3 text-neutral-grey-800">Équipe ({otherMembers.length + 1})</p>
                <ul className="flex flex-wrap items-center gap-1">
                    <li className="flex items-center gap-[5px]">
                        <span className="flex size-[27px] items-center justify-center rounded-full bg-brand-light-orange text-[10px] text-neutral-grey-950">
                            {getInitials(project.owner)}
                        </span>
                        <span className="rounded-full bg-brand-light-orange px-3 py-1 text-xs text-brand-dark-orange">Propriétaire</span>
                    </li>
                    {otherMembers.map(member => (
                        <li
                            key={member.id}
                            className="-ml-2 flex size-[27px] items-center justify-center rounded-full bg-neutral-grey-200 text-[10px] text-neutral-grey-800 ring-2 ring-neutral-white first:ml-0"
                        >
                            {getInitials(member.user)}
                        </li>
                    ))}
                </ul>
            </div>
        </article>
    )
}

export default ProjectCard
