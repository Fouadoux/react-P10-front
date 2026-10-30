import { getCurrentUser } from '@/lib/auth/currentUser'
import { getDisplayName } from '@/lib/displayName'

// "Bonjour Alice Dupont, ..." line under the dashboard title.
// Reads the user at request time: must be rendered inside a <Suspense>.
const Greeting = async () => {
    const user = await getCurrentUser()

    return (
        <p className="text-base text-neutral-grey-950">
            Bonjour {getDisplayName(user)}, voici un aperçu de vos projets et tâches
        </p>
    )
}

export default Greeting
