import AccountForm from '@/components/account/AccountForm'
import { getCurrentUser } from '@/lib/auth/currentUser'
import { getDisplayName } from '@/lib/users/displayName'

// Card of the "Mon compte" page: title, the user's name, and (soon) the form to edit them.
// Async server component: it reads the logged-in user at request time, so the page wraps it in a <Suspense>.
const AccountDetails = async () => {
    const user = await getCurrentUser()

    return (
        <section aria-labelledby="account-title" className="flex flex-col gap-10 rounded-[10px] border border-neutral-grey-200 bg-neutral-white px-[59px] py-10">
            <header className="flex flex-col gap-2">
                <h1 id="account-title" className="font-heading text-lg font-semibold text-neutral-grey-800">Mon compte</h1>
                <p className="text-base text-neutral-grey-500">{getDisplayName(user)}</p>
            </header>
            {/* No user means the session is no longer valid: the proxy / authFetch send the visitor back to /login */}
            {user && <AccountForm user={user} />}
        </section>
    )
}

export default AccountDetails
