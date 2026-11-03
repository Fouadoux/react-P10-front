import { Suspense } from 'react'
import DashboardContent from '@/components/dashboard/DashboardContent'
import Greeting from '@/components/dashboard/Greeting'
import CreateProjectModal from '@/components/projects/CreateProjectModal'

type DashboardPageProps = {
    searchParams: Promise<{ view?: string }>
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
    return (
        <div className="flex flex-col gap-10 px-[100px] py-12">
            <div className="flex items-start justify-between gap-6">
                <div className="flex flex-col gap-3">
                    <h1 className="font-heading text-2xl font-semibold text-neutral-grey-950">Tableau de bord</h1>
                    {/* The greeting needs the user (request-time read): empty line of the same height while loading */}
                    <Suspense fallback={<p className="h-6" />}>
                        <Greeting />
                    </Suspense>
                </div>
                <CreateProjectModal />
            </div>
            {/* Tabs and their content depend on the URL (?view=...): request-time read, hence the Suspense */}
            <Suspense fallback={<p role="status" className="text-neutral-grey-800">Chargement…</p>}>
                <DashboardContent searchParams={searchParams} />
            </Suspense>
        </div>
    )
}
