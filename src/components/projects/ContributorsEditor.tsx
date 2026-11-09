'use client'

import AddContributorForm from '@/components/projects/AddContributorForm'
import RemoveContributorForm from '@/components/projects/RemoveContributorForm'
import { getDisplayName } from '@/lib/users/displayName'
import type { Project } from '@/types'

type ContributorsEditorProps = {
    project: Project
}

// "Contributeurs" section of the "Modifier un projet" modal: who is in the project (with a "Retirer"
// button for everyone but the owner) and a field to add someone by email
const ContributorsEditor = ({ project }: ContributorsEditorProps) => {
    const otherMembers = project.members.filter(member => member.userId !== project.ownerId)

    return (
        <section aria-label="Contributeurs" className="flex w-full flex-col gap-4 border-t border-neutral-grey-200 pt-6">
            <h3 className="text-base text-neutral-grey-950">Contributeurs</h3>
            <ul className="flex flex-col gap-3">
                <li className="flex items-center justify-between gap-4 text-sm text-neutral-grey-950">
                    <span>{getDisplayName(project.owner)}</span>
                    <span className="rounded-full bg-brand-light-orange px-3 py-1 text-xs text-brand-dark-orange">Propriétaire</span>
                </li>
                {otherMembers.map(member => (
                    <li key={member.id} className="flex items-start justify-between gap-4 text-sm text-neutral-grey-950">
                        <span>{getDisplayName(member.user)}</span>
                        <RemoveContributorForm
                            projectId={project.id}
                            userId={member.userId}
                            displayName={getDisplayName(member.user)}
                        />
                    </li>
                ))}
            </ul>
            <AddContributorForm projectId={project.id} />
        </section>
    )
}

export default ContributorsEditor
