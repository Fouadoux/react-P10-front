import { Suspense } from 'react'
import KanbanBoard from '@/components/dashboard/KanbanBoard'
import ViewTabs from '@/components/dashboard/ViewTabs'
import AssignedTasks from '@/components/tasks/AssignedTasks'
import { getDashboardView } from '@/lib/dashboardView'

type DashboardContentProps = {
    // Query string of the page, e.g. { view: 'kanban' } for /dashboard?view=kanban, or { q: 'quiz' } for a search
    searchParams: Promise<{ view?: string; q?: string }>
}

// Tabs + the view they select. Reading the URL's query string is a request-time read:
// the page must render this component inside a <Suspense>.
const DashboardContent = async ({ searchParams }: DashboardContentProps) => {
    const { view: rawView, q } = await searchParams
    const view = getDashboardView(rawView)
    const query = q?.trim() ?? ''

    return (
        <div className="flex flex-col gap-8">
            <ViewTabs activeView={view} />
            {view === 'list' ? (
                <Suspense fallback={<p role="status" className="text-neutral-grey-800">Chargement de vos tâches…</p>}>
                    <AssignedTasks query={query} />
                </Suspense>
            ) : (
                <Suspense fallback={<p role="status" className="text-neutral-grey-800">Chargement de vos tâches…</p>}>
                    <KanbanBoard />
                </Suspense>
            )}
        </div>
    )
}

export default DashboardContent
