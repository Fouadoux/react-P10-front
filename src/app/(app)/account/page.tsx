import { Suspense } from 'react'
import AccountDetails from '@/components/account/AccountDetails'

export default function AccountPage() {
    return (
        <div className="px-[100px] py-12">
            {/* The user comes from the backend (request-time read): streamed behind a Suspense */}
            <Suspense fallback={<p role="status" className="text-neutral-grey-800">Chargement de votre compte…</p>}>
                <AccountDetails />
            </Suspense>
        </div>
    )
}
