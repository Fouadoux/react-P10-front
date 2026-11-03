import { Suspense } from 'react'
import ProjectDetails from '@/components/projects/ProjectDetails'

type ProjectPageProps = {
    params: Promise<{ projectId: string }>
}

export default function ProjectPage({ params }: ProjectPageProps) {
    return (
        <div className="px-[100px] py-12">
            {/* The project comes from the backend (request-time read): streamed behind a Suspense */}
            <Suspense fallback={<p role="status" className="text-neutral-grey-800">Chargement du projet…</p>}>
                <ProjectDetails params={params} />
            </Suspense>
        </div>
    )
}
