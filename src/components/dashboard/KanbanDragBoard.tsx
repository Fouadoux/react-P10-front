'use client'

import { DragDropContext, type DragStart, type DragUpdate, type DropResult, type ResponderProvided } from '@hello-pangea/dnd'
import { startTransition, useOptimistic, useState } from 'react'
import { updateTaskStatusAction } from '@/app/actions/tasks'
import KanbanColumn from '@/components/dashboard/KanbanColumn'
import { groupTasksByStatus } from '@/lib/tasks/groups'
import type { Task, TaskStatus } from '@/types'

// The three columns, left to right. The id of a column is the status given to the tasks dropped in it.
const COLUMNS = [
    { status: 'TODO', title: 'À faire' },
    { status: 'IN_PROGRESS', title: 'En cours' },
    { status: 'DONE', title: 'Terminées' },
] as const

// Read aloud by screen readers when a card gets the focus (the library links it to each card)
const USAGE_INSTRUCTIONS =
    'Pour déplacer cette tâche, appuyez sur la barre d’espace, changez de colonne avec les flèches gauche et droite, ' +
    'puis appuyez de nouveau sur la barre d’espace pour la déposer. La touche Échap annule le déplacement.'

// Read aloud when a drag ends without moving the card to another column (dropped outside, Escape...)
const CANCELLED_MESSAGE = 'Déplacement annulé. La tâche reste dans sa colonne d’origine.'

// Name of a column, read aloud by the screen reader announcements
const getColumnTitle = (columnId: string): string => COLUMNS.find((column) => column.status === columnId)?.title ?? columnId

type KanbanDragBoardProps = {
    // The tasks of the month, as sent by the server
    tasks: Task[]
}

// The Kanban: three columns where the cards can be dragged from one to another.
// 'use client' because dragging only exists in the browser.
const KanbanDragBoard = ({ tasks }: KanbanDragBoardProps) => {
    // Column of the card being dragged (null when nothing is dragged): it is used to forbid dropping a card back in its own column
    const [draggingFrom, setDraggingFrom] = useState<string | null>(null)
    // Shown above the columns when the backend refuses a move
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    // The tasks as shown on screen: the server's list plus the move being saved
    const [afficher, ajouter] = useOptimistic(
        tasks,
        (current: Task[], move: { id: string; status: TaskStatus }) =>
            current.map((t) => (t.id === move.id ? { ...t, status: move.status } : t)),
    )
    const columns = groupTasksByStatus(afficher)

    // The `provided.announce` calls below are the texts read aloud by screen readers during a drag.
    // They replace the library's default messages (in English).
    const handleDragStart = (start: DragStart, provided: ResponderProvided) => {
        setDraggingFrom(start.source.droppableId)
        const title = tasks.find((t) => t.id === start.draggableId)?.title
        provided.announce(`Tâche « ${title} » saisie, colonne ${getColumnTitle(start.source.droppableId)}. Changez de colonne avec les flèches gauche et droite.`)
    }

    const handleDragUpdate = (update: DragUpdate, provided: ResponderProvided) => {
        provided.announce(
            update.destination
                ? `Au-dessus de la colonne ${getColumnTitle(update.destination.droppableId)}.`
                : 'Au-dessus d’aucune autre colonne.',
        )
    }

    const handleDragEnd = (result: DropResult, provided: ResponderProvided) => {
        setDraggingFrom(null)
        setErrorMessage(null)

        if (!result.destination) {
            provided.announce(CANCELLED_MESSAGE)
            return
        }
        const taskId = result.draggableId
        const task = tasks.find((t) => t.id === taskId)
        if (!task) {
            provided.announce(CANCELLED_MESSAGE)
            return
        }
        const column = COLUMNS.find((s) => s.status === result.destination?.droppableId)
        if (!column) {
            provided.announce(CANCELLED_MESSAGE)
            return
        }
        provided.announce(`Tâche « ${task.title} » déplacée dans la colonne ${column.title}.`)
        startTransition(async () => {
            ajouter({ id: task.id, status: column.status })
            try {
                const response = await updateTaskStatusAction(task.projectId, task.id, column.status)
                if (!response.success) {
                    setErrorMessage(response.message)
                }
            } catch {
                // The server could not be reached at all
                setErrorMessage('le serveur ne répond pas.')
            }
        })
    }

    return (
        <div className="flex flex-col gap-4">
            {errorMessage && (
                <p role="alert" className="rounded-[10px] bg-status-todo-bg px-4 py-3 text-sm text-status-todo-text">
                    La tâche n’a pas pu être déplacée : {errorMessage}
                </p>
            )}
            <DragDropContext
                onDragStart={handleDragStart}
                onDragUpdate={handleDragUpdate}
                onDragEnd={handleDragEnd}
                dragHandleUsageInstructions={USAGE_INSTRUCTIONS}
            >
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    {COLUMNS.map(({ status, title }) => (
                        <KanbanColumn
                            key={status}
                            status={status}
                            title={title}
                            tasks={columns[status]}
                            isDropDisabled={draggingFrom === status}
                        />
                    ))}
                </div>
            </DragDropContext>
        </div>
    )
}

export default KanbanDragBoard
