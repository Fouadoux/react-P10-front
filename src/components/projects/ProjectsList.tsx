import ProjectCard from '@/components/projects/ProjectCard'
import { getProjects, getProjectTasks } from '@/lib/projects/api'
import { getProjectProgress } from '@/lib/projects/progress'

// Grid of the user's projects, each with its progress.
// Must be rendered inside a <Suspense> (it reads the session cookie at request time).
const ProjectsList = async () => {
    const projects = await getProjects()
    // One request per project, all at once; taskLists[i] holds the tasks of projects[i]
    const taskLists = await Promise.all(projects.map(project => getProjectTasks(project.id)))

    if (projects.length === 0) {
        return <p className="text-neutral-grey-800">Vous n&apos;avez aucun projet pour le moment.</p>
    }

    return (
        <ul className="grid grid-cols-1 gap-[14px] md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
                <li key={project.id}>
                    <ProjectCard project={project} progress={getProjectProgress(taskLists[index])} />
                </li>
            ))}
        </ul>
    )
}

export default ProjectsList
