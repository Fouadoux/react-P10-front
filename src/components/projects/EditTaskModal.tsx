'use client'

import { updateTaskAction } from '@/app/actions/tasks'
import TaskForm, { type TaskFormValues } from '@/components/projects/TaskForm'
import ModalDialog from '@/components/ui/ModalDialog'
import type { ProjectTask, UserSummary } from '@/types'

type EditTaskModalProps = {
    task: ProjectTask
    people: UserSummary[]
    isOpen: boolean
    onClose: () => void
}

// "Modifier" modal of a task: the shared task form, filled with the task's current values
const EditTaskModal = ({ task, people, isOpen, onClose }: EditTaskModalProps) => {
    const initialValues: TaskFormValues = {
        title: task.title,
        description: task.description ?? '',
        // The backend sends an ISO date ("2026-11-10T00:00:00.000Z"): a date input only wants "2026-11-10"
        dueDate: task.dueDate?.slice(0, 10) ?? '',
        assigneeIds: task.assignees.map(assignee => assignee.user.id),
        status: task.status,
    }

    return (
        <ModalDialog isOpen={isOpen} onClose={onClose} title="Modifier">
            <TaskForm
                action={updateTaskAction}
                projectId={task.projectId}
                taskId={task.id}
                people={people}
                initialValues={initialValues}
                submitLabel="Enregistrer"
                onSuccess={onClose}
            />
        </ModalDialog>
    )
}

export default EditTaskModal
