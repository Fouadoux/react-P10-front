import type { Project, UserSummary } from '@/types'

// The people of a project: the owner first, then the other members
// (the owner can also appear in the members list: no duplicate)
export const getProjectPeople = (project: Project): UserSummary[] => [
    project.owner,
    ...project.members.map(member => member.user).filter(user => user.id !== project.owner.id),
]
