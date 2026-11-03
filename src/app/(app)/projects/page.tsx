import { Suspense } from 'react'
import CreateProjectModal from '@/components/projects/CreateProjectModal'
import ProjectsList from '@/components/projects/ProjectsList'

export const metadata = { title: 'Projets - Abricot' }

export default function ProjectsPage() {
    return (
        <div className="flex flex-col gap-10 px-[137px] py-12">
            <div className="flex items-start justify-between gap-6">
                <div className="flex flex-col gap-3">
                    <h1 className="font-heading text-2xl font-semibold text-neutral-grey-950">Mes projets</h1>
                    <p className="text-base text-neutral-grey-950">Gérez vos projets</p>
                </div>
                <CreateProjectModal />
            </div>
            {/* The projects come from the backend (request-time read): streamed behind a Suspense */}
            <Suspense fallback={<p role="status" className="text-neutral-grey-800">Chargement de vos projets…</p>}>
                <ProjectsList />
            </Suspense>
        </div>
    )
}
