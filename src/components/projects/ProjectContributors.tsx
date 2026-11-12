import type { Project } from '@/types'
import { getInitials } from '@/lib/users/initials'
import { getDisplayName } from '@/lib/users/displayName'

type ProjectContributorsProps = {
    project: Project
}

// Grey bar under the header: "Contributeurs, 3 personnes" and one chip per person (the owner first)
const ProjectContributors = ({ project }: ProjectContributorsProps) => {
    const otherMembers = project.members.filter(member => member.userId !== project.ownerId)
    const peopleCount = otherMembers.length + 1

    return (
        <section aria-label="Contributeurs" className="flex flex-wrap items-center justify-between gap-4 rounded-[10px] bg-neutral-grey-200/60 px-[40px] py-5">
            <h2 className="flex items-baseline gap-2 text-lg text-neutral-grey-950">
                Contributeurs
                <span className="text-sm text-neutral-grey-500">{peopleCount} {peopleCount > 1 ? 'personnes' : 'personne'}</span>
            </h2>
            <ul className="flex flex-wrap items-center gap-3">
                <li className="flex items-center gap-2">
                    <span className="flex size-[27px] items-center justify-center rounded-full bg-brand-light-orange text-[10px] text-neutral-grey-950">
                        {getInitials(project.owner)}
                    </span>
                    <span className="rounded-full bg-brand-light-orange px-3 py-1 text-xs text-brand-dark-orange">Propriétaire</span>
                </li>
                {otherMembers.map(member => (
                    <li key={member.id} className="flex items-center gap-2">
                        <span className="flex size-[27px] items-center justify-center rounded-full bg-neutral-grey-200 text-[10px] text-neutral-grey-800">
                            {getInitials(member.user)}
                        </span>
                        <span className="rounded-full bg-neutral-grey-200 px-3 py-1 text-xs text-neutral-grey-500">
                            {getDisplayName(member.user)}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    )
}

export default ProjectContributors
