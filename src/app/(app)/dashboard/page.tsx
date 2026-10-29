import { Suspense } from 'react'
import AssignedTasks from '@/components/tasks/AssignedTasks'

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-10 px-[100px] py-12">
            <h1 className="font-heading text-2xl font-semibold text-neutral-grey-950">Tableau de bord</h1>
            {/* The tasks come from the backend (request-time read): streamed behind a Suspense */}
            <Suspense fallback={<p role="status" className="text-neutral-grey-800">Chargement de vos tâches…</p>}>
                <AssignedTasks />
            </Suspense>
        </div>
    )
}
