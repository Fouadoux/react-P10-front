'use client'

import { useActionState, useEffect, useState } from 'react'
import { addGeneratedTasksAction, generateTasksAction, type AddTasksState, type GenerateTasksState } from '@/app/actions/ai'
import AiTaskCard from '@/components/projects/AiTaskCard'
import Button from '@/components/ui/Button'
import type { DraftTask, GeneratedTask } from '@/lib/ai/schema'
import { isBlank } from '@/lib/forms/isBlank'

const initialGenerateState: GenerateTasksState = { message: null, notice: null, tasks: null }
const initialAddState: AddTasksState = { message: null, success: false, createdIds: [] }

type AiTasksPanelProps = {
    projectId: string
    // Called once the tasks are added to the project, so the modal can close
    onClose: () => void
}

// Content of the "IA" modal: the review list of the generated tasks (edit, delete, add one by hand)
// and, at the bottom, the box where the user describes the tasks they want.
// 'use client' because the list is edited in the browser before anything is saved.
const AiTasksPanel = ({ projectId, onClose }: AiTasksPanelProps) => {
    const [generateState, generateAction, isGenerating] = useActionState(generateTasksAction, initialGenerateState)
    const [addState, addAction, isAdding] = useActionState(addGeneratedTasksAction, initialAddState)
    const [tasks, setTasks] = useState<DraftTask[]>([])
    const [prompt, setPrompt] = useState<string>('')

    // New AI answer: its tasks join the list and the box is emptied (adjusting state while rendering, no useEffect)
    const [handledGenerateState, setHandledGenerateState] = useState<GenerateTasksState>(generateState)
    if (generateState !== handledGenerateState) {
        setHandledGenerateState(generateState)
        const generatedTasks = generateState.tasks
        if (generatedTasks) {
            setTasks(previous => [...previous, ...generatedTasks])
            setPrompt('')
        }
    }

    // Answer of the "Ajouter" button: the tasks that were created leave the list
    const [handledAddState, setHandledAddState] = useState<AddTasksState>(addState)
    if (addState !== handledAddState) {
        setHandledAddState(addState)
        setTasks(previous => previous.filter(task => !addState.createdIds.includes(task.id)))
    }

    useEffect(() => {
        if (addState.success) onClose()
    }, [addState.success, onClose])

    const updateTask = (id: string, patch: Partial<GeneratedTask>) =>
        setTasks(previous => previous.map(task => (task.id === id ? { ...task, ...patch } : task)))
    const deleteTask = (id: string) => setTasks(previous => previous.filter(task => task.id !== id))
    const addEmptyTask = () =>
        setTasks(previous => [...previous, { id: crypto.randomUUID(), title: '', description: '', dueDate: '', status: 'TODO' }])

    // Same rule as the "Créer une tâche" form: title, description and due date are required
    const canAdd = tasks.length > 0 && tasks.every(task => !isBlank(task.title) && !isBlank(task.description) && task.dueDate !== '')

    return (
        <div className="flex flex-col gap-8">
            {tasks.length === 0 && (
                <p className="text-base text-neutral-grey-800">
                    Décrivez les tâches que vous souhaitez ajouter : l&apos;IA vous propose une liste que vous pourrez modifier avant de l&apos;intégrer au projet.
                </p>
            )}

            {tasks.length > 0 && (
                <section aria-labelledby="ai-tasks-title" className="flex flex-col gap-6">
                    <h3 id="ai-tasks-title" className="text-xl text-neutral-grey-950">Vos tâches…</h3>
                    <ul className="flex flex-col gap-4">
                        {tasks.map(task => (
                            <AiTaskCard
                                key={task.id}
                                task={task}
                                onChange={patch => updateTask(task.id, patch)}
                                onDelete={() => deleteTask(task.id)}
                            />
                        ))}
                    </ul>
                    <button
                        type="button"
                        onClick={addEmptyTask}
                        className="cursor-pointer self-start text-sm text-brand-dark-orange underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange"
                    >
                        + Ajouter une tâche à la main
                    </button>
                    <form action={addAction} className="flex flex-col items-center gap-3">
                        <input type="hidden" name="projectId" value={projectId} />
                        <input type="hidden" name="tasks" value={JSON.stringify(tasks)} />
                        {addState.message && <p role="alert" className="text-red-700">{addState.message}</p>}
                        {!canAdd && <p id="ai-add-hint" className="text-sm text-neutral-grey-800">Chaque tâche doit avoir un titre, une description et une échéance.</p>}
                        <Button label="+ Ajouter les tâches" type="submit" disabled={isAdding || !canAdd} />
                    </form>
                </section>
            )}

            {generateState.notice && <p role="status" className="text-sm text-neutral-grey-800">{generateState.notice}</p>}
            {generateState.message && <p role="alert" className="text-red-700">{generateState.message}</p>}
            {isGenerating && <p role="status" className="text-sm text-neutral-grey-800">Génération en cours…</p>}

            {/* The prompt box of the mockup: a round field with the orange send button on its right */}
            <form action={generateAction} className="flex items-center gap-3 rounded-[30px] bg-neutral-grey-50 py-3 pl-8 pr-4">
                <input type="hidden" name="projectId" value={projectId} />
                <label htmlFor="ai-prompt" className="sr-only">Décrivez les tâches que vous souhaitez ajouter</label>
                <textarea
                    id="ai-prompt"
                    name="prompt"
                    rows={2}
                    maxLength={4000}
                    value={prompt}
                    onChange={event => setPrompt(event.target.value)}
                    placeholder="Décrivez les tâches que vous souhaitez ajouter…"
                    className="w-full resize-none bg-transparent py-2 text-sm text-neutral-grey-950 placeholder:text-neutral-grey-800 focus:outline-none"
                />
                <button
                    type="submit"
                    disabled={isGenerating || isBlank(prompt)}
                    aria-label="Générer les tâches"
                    className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-brand-dark-orange text-neutral-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-grey-950 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 2l2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6z" />
                    </svg>
                </button>
            </form>
        </div>
    )
}

export default AiTasksPanel
