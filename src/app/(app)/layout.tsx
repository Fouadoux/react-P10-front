import { Suspense } from 'react'
import type { ReactNode } from 'react'
import Footer from '@/components/layout/Footer'
import UserMenu from '@/components/layout/UserMenu'

type AppLayoutProps = {
    // The page being displayed (dashboard, projects...), inserted in the middle
    children: ReactNode
}

// Layout shared by every logged-in page: menu on top, the current page in the middle, footer at the bottom
export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-neutral-grey-50">
            {/* The menu reads the user at request time: the fallback is an empty bar of the same height */}
            <Suspense fallback={<header className="h-[94px] bg-neutral-white shadow-[0px_4px_12px_1px_rgba(0,0,0,0.02)]" />}>
                <UserMenu />
            </Suspense>
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    )
}
