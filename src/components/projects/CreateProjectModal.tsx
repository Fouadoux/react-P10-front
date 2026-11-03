'use client'

import CreateProjectForm from '@/components/projects/CreateProjectForm'
import Modal from '@/components/ui/Modal'

// "+ Créer un projet" button and the modal it opens (used on the dashboard and on the projects page).
// 'use client' is required: it gives a function ({close => ...}) to Modal, and a function cannot be sent
// from a server component to a client component.
const CreateProjectModal = () => (
    <Modal triggerLabel="+ Créer un projet" title="Créer un projet">
        {close => <CreateProjectForm onSuccess={close} />}
    </Modal>
)

export default CreateProjectModal
