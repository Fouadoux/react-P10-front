'use client'

import ContributorsEditor from '@/components/projects/ContributorsEditor'
import EditProjectForm from '@/components/projects/EditProjectForm'
import Modal from '@/components/ui/Modal'
import type { Project } from '@/types'

type EditProjectModalProps = {
    project: Project
}

// "Modifier" button of the project page and the modal it opens.
// 'use client' for the same reason as CreateProjectModal: it gives a function to Modal.
const EditProjectModal = ({ project }: EditProjectModalProps) => (
    <Modal triggerLabel="Modifier" title="Modifier un projet">
        {close => (
            <div className="flex w-full flex-col gap-6">
                <EditProjectForm project={project} onSuccess={close} />
                <ContributorsEditor project={project} />
            </div>
        )}
    </Modal>
)

export default EditProjectModal
