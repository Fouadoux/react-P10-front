'use client'

import { Draggable, Droppable } from '@hello-pangea/dnd'
import KanbanCard from '@/components/tasks/KanbanCard'
import type { Task, TaskStatus } from '@/types'

type KanbanColumnProps = {
    // Status given to a task dropped here (it is also the id of the drop zone)
    status: TaskStatus
    title: string
    tasks: Task[]
    // True while a task from this very column is being dragged: dropping it back here would change nothing
    isDropDisabled: boolean
}

// One column of the Kanban: a drop zone (Droppable) that holds draggable task cards (Draggable).
// The whole card is the drag handle (mouse, finger, or Space then the arrow keys); the "Voir" link inside stays clickable.
// The library gives each element props to spread on it (innerRef, droppableProps, draggableProps, dragHandleProps):
// it uses them to measure the elements and to move them while dragging.
const KanbanColumn = ({ status, title, tasks, isDropDisabled }: KanbanColumnProps) => {
    return (
        <section className="flex flex-col gap-8 rounded-[10px] border border-neutral-grey-200 bg-neutral-white p-6">
            <h2 className="flex items-center gap-2 text-xl text-neutral-grey-950">
                {title}
                <span className="rounded-full bg-neutral-grey-200 px-2.5 py-0.5 text-sm text-neutral-grey-800">{tasks.length}</span>
            </h2>
            <Droppable droppableId={status} isDropDisabled={isDropDisabled}>
                {(dropProvided, dropSnapshot) => (
                    <ul
                        ref={dropProvided.innerRef}
                        {...dropProvided.droppableProps}
                        className={`flex min-h-24 flex-1 flex-col gap-4 rounded-[10px] transition-colors ${dropSnapshot.isDraggingOver ? 'bg-brand-light-orange/60' : ''}`}
                    >
                        {tasks.map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(dragProvided, dragSnapshot) => (
                                    <li
                                        ref={dragProvided.innerRef}
                                        {...dragProvided.draggableProps}
                                        {...dragProvided.dragHandleProps}
                                        // The library gives role="button" to the handle; a list item with a link inside must stay a list item
                                        role="listitem"
                                        aria-roledescription="tâche déplaçable"
                                        className={`rounded-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange ${dragSnapshot.isDragging ? 'cursor-grabbing shadow-lg' : 'cursor-grab'}`}
                                    >
                                        <KanbanCard task={task} />
                                    </li>
                                )}
                            </Draggable>
                        ))}
                        {dropProvided.placeholder}
                    </ul>
                )}
            </Droppable>
        </section>
    )
}

export default KanbanColumn
