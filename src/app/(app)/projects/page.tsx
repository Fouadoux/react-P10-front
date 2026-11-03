import Link from 'next/link'
import { Suspense } from 'react'
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
                {/* /projects/new does not exist yet: this link leads to a 404 for now */}
                <Link
                    href="/projects/new"
                    className="rounded-[6px] bg-neutral-grey-950 px-6 py-3.5 text-base text-neutral-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange"
                >
                    + Créer un projet
                </Link>
            </div>
            {/* The projects come from the backend (request-time read): streamed behind a Suspense */}
            <Suspense fallback={<p role="status" className="text-neutral-grey-800">Chargement de vos projets…</p>}>
                <ProjectsList />
            </Suspense>
        </div>
    )
}
