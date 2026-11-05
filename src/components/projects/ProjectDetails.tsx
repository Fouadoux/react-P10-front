import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import ProjectContributors from '@/components/projects/ProjectContributors'
import ProjectHeader from '@/components/projects/ProjectHeader'
import ProjectTasks from '@/components/projects/ProjectTasks'
import { getProject } from '@/lib/projects/api'
import { getProjectPeople } from '@/lib/projects/people'

type ProjectDetailsProps = {
    // The dynamic part of the URL: /projects/<projectId>
    params: Promise<{ projectId: string }>
}

// Content of the project page. Reading the URL and the backend are request-time reads:
// the page must render this component inside a <Suspense>.
const ProjectDetails = async ({ params }: ProjectDetailsProps) => {
    const { projectId } = await params
    const project = await getProject(projectId)

    // Unknown project, or a project the user is not a member of: same 404 page
    if (!project) notFound()

    return (
        <div className="flex flex-col gap-10">
            <ProjectHeader project={project} />
            <ProjectContributors project={project} />
            <Suspense fallback={<p role="status" className="text-neutral-grey-800">Chargement des tâches…</p>}>
                <ProjectTasks projectId={project.id} people={getProjectPeople(project)} />
            </Suspense>
        </div>
    )
}

export default ProjectDetails
