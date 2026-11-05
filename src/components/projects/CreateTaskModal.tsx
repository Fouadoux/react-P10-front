'use client'

import { createTaskAction } from '@/app/actions/tasks'
import TaskForm from '@/components/projects/TaskForm'
import Modal from '@/components/ui/Modal'
import { getProjectPeople } from '@/lib/projects/people'
import type { Project } from '@/types'

type CreateTaskModalProps = {
    project: Project
}

// "Créer une tâche" button of the project page and the modal it opens
const CreateTaskModal = ({ project }: CreateTaskModalProps) => (
    <Modal triggerLabel="Créer une tâche" title="Créer une tâche">
        {close => (
            <TaskForm
                action={createTaskAction}
                projectId={project.id}
                people={getProjectPeople(project)}
                submitLabel="+ Ajouter une tâche"
                onSuccess={close}
            />
        )}
    </Modal>
)

export default CreateTaskModal
