import Image from 'next/image'
import Link from 'next/link'
import type { DashboardView } from '@/lib/dashboardView'

type Tab = {
    view: DashboardView
    label: string
    icon: string
}

const TABS: Tab[] = [
    { view: 'list', label: 'Liste', icon: '/icons/icon-list-orange.svg' },
    { view: 'kanban', label: 'Kanban', icon: '/icons/icon-kanban-orange.svg' },
]

type ViewTabsProps = {
    activeView: DashboardView
}

// "Liste / Kanban" chips: each one is a link that puts the view in the URL (/dashboard?view=kanban)
const ViewTabs = ({ activeView }: ViewTabsProps) => (
    <nav aria-label="Affichage des tâches" className="flex gap-2.5">
        {TABS.map(({ view, label, icon }) => {
            const isActive = view === activeView
            return (
                <Link
                    key={view}
                    href={`/dashboard?view=${view}`}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-2 rounded-[6px] px-4 py-3 text-sm text-brand-dark-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange ${isActive ? 'bg-brand-light-orange' : 'bg-neutral-white'}`}
                >
                    <Image src={icon} alt="" width={16} height={16} />
                    {label}
                </Link>
            )
        })}
    </nav>
)

export default ViewTabs
