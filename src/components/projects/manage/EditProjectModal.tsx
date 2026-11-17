'use client'

import ContributorsEditor from '@/components/projects/contributors/ContributorsEditor'
import EditProjectForm from '@/components/projects/manage/EditProjectForm'
import Modal from '@/components/ui/Modal'
import type { Project } from '@/types'

type EditProjectModalProps = {
    project: Project
}

// The "Modifier" link looks like the mockup: small orange underlined text next to the project name
const triggerClassName = 'cursor-pointer text-sm text-brand-dark-orange underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange'

// "Modifier" link of the project page and the modal it opens.
// 'use client' for the same reason as CreateProjectModal: it gives a function to Modal.
const EditProjectModal = ({ project }: EditProjectModalProps) => (
    <Modal triggerLabel="Modifier" title="Modifier un projet" triggerClassName={triggerClassName}>
        {close => (
            <div className="flex w-full flex-col gap-6">
                <EditProjectForm project={project} onSuccess={close} />
                <ContributorsEditor project={project} />
            </div>
        )}
    </Modal>
)

export default EditProjectModal
