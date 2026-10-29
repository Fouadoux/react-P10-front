import Menu from '@/components/layout/Menu'
import { getCurrentUser } from '@/lib/auth/currentUser'
import { getInitials } from '@/lib/getInitials'

// Reads the logged-in user (a request-time read) and shows the menu with their initials.
// Rendered inside a <Suspense> by the layout so it doesn't block the rest of the page.
const UserMenu = async () => {
    const user = await getCurrentUser()
    return <Menu initials={getInitials(user)} />
}

export default UserMenu
