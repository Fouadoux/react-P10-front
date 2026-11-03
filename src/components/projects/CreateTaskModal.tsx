'use client'

import CreateTaskForm from '@/components/projects/CreateTaskForm'
import Modal from '@/components/ui/Modal'
import type { Project, UserSummary } from '@/types'

type CreateTaskModalProps = {
    project: Project
}

// "Créer une tâche" button of the project page and the modal it opens
const CreateTaskModal = ({ project }: CreateTaskModalProps) => {
    // The owner first, then the other members (the owner can also appear in the members list: no duplicate)
    const people: UserSummary[] = [
        project.owner,
        ...project.members.map(member => member.user).filter(user => user.id !== project.owner.id),
    ]

    return (
        <Modal triggerLabel="Créer une tâche" title="Créer une tâche">
            {close => <CreateTaskForm projectId={project.id} people={people} onSuccess={close} />}
        </Modal>
    )
}

export default CreateTaskModal
