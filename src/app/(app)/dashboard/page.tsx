import Link from 'next/link'
import { Suspense } from 'react'
import DashboardContent from '@/components/dashboard/DashboardContent'
import Greeting from '@/components/dashboard/Greeting'

type DashboardPageProps = {
    searchParams: Promise<{ view?: string }>
}

export default function DashboardPage({ searchParams }: DashboardPageProps) {
    return (
        <div className="flex flex-col gap-10 px-[100px] py-12">
            <div className="flex items-start justify-between gap-6">
                <div className="flex flex-col gap-3">
                    <h1 className="font-heading text-2xl font-semibold text-neutral-grey-950">Tableau de bord</h1>
                    {/* The greeting needs the user (request-time read): empty line of the same height while loading */}
                    <Suspense fallback={<p className="h-6" />}>
                        <Greeting />
                    </Suspense>
                </div>
                {/* /projects/new does not exist yet: this link leads to a 404 for now */}
                <Link
                    href="/projects/new"
                    className="rounded-[6px] bg-neutral-grey-950 px-6 py-3.5 text-base text-neutral-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange"
                >
                    + Créer un projet
                </Link>
            </div>
            {/* Tabs and their content depend on the URL (?view=...): request-time read, hence the Suspense */}
            <Suspense fallback={<p role="status" className="text-neutral-grey-800">Chargement…</p>}>
                <DashboardContent searchParams={searchParams} />
            </Suspense>
        </div>
    )
}
