import Link from 'next/link'
import Logo from '@/components/ui/Logo'

export const metadata = { title: 'Page introuvable - Abricot' }

// Shown for an unknown URL and whenever a page calls notFound() (e.g. a project that does not exist).
// It sits outside the logged-in layout on purpose: the visitor may not be logged in, so there is no menu here.
// Server component: nothing in it needs the browser.
export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between bg-neutral-grey-50 px-6 py-[55px]">
            <Logo />
            <div className="flex flex-col items-center gap-6 text-center">
                {/* The big number is decoration: the heading below already says what happened */}
                <p aria-hidden="true" className="font-heading text-[96px] font-bold leading-none text-brand-dark-orange sm:text-[140px]">404</p>
                <h1 className="font-heading text-2xl font-semibold text-neutral-grey-950 sm:text-[40px]">Page introuvable</h1>
                <p className="max-w-[420px] text-base text-neutral-grey-500">
                    La page que vous cherchez n&apos;existe pas, a été déplacée, ou vous n&apos;y avez pas accès.
                </p>
                {/* Same look as the Button component, but a link: it navigates instead of acting */}
                <Link
                    href="/dashboard"
                    className="flex h-[50px] items-center justify-center rounded-[10px] bg-neutral-grey-800 px-8 text-base text-neutral-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange sm:px-[74px]"
                >
                    Retour au tableau de bord
                </Link>
            </div>
            <p className="text-sm text-neutral-grey-500">Abricot 2025</p>
        </main>
    )
}
