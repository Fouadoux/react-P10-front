'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo from '@/components/ui/Logo'
import { logoutAction } from '@/app/actions/auth'

// Tailwind classes taken from the mockup: shared shape + one look per state
const itemBaseClass = 'flex w-62 items-center justify-center gap-4 whitespace-nowrap rounded-[10px] py-[27px] text-base'
const itemActiveClass = 'bg-neutral-grey-950 text-neutral-white'
const itemInactiveClass = 'bg-neutral-white text-brand-dark-orange'

type NavItemProps = {
    href: string
    label: string
    icon: string
    activeIcon: string
}

const NavItem = ({ href, label, icon, activeIcon }: NavItemProps) => {
    const pathname = usePathname()
    // "/projects/42" must keep the "Projets" tab highlighted too
    const isActive = pathname === href || pathname.startsWith(`${href}/`)

    return (
        <Link
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={`${itemBaseClass} ${isActive ? itemActiveClass : itemInactiveClass}`}
        >
            <Image src={isActive ? activeIcon : icon} alt="" width={24} height={24} className="size-6" />
            <span>{label}</span>
        </Link>
    )
}

type MenuProps = {
    // Letters shown in the avatar circle (see getInitials)
    initials: string
}

const Menu = ({ initials }: MenuProps) => {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <header className="flex h-[94px] items-center justify-between bg-neutral-white px-[100px] py-2 shadow-[0px_4px_12px_1px_rgba(0,0,0,0.02)]">
            <Logo className="h-[18.7px] w-[147px]" />
            <nav className="flex items-start gap-4">
                <NavItem
                    href="/dashboard"
                    label="Tableau de bord"
                    icon="/icons/icon-dashboard-orange.svg"
                    activeIcon="/icons/icon-dashboard-white.svg"
                />
                {/* The mockup has no "active" variant of the folder icon yet: same icon for both states */}
                <NavItem
                    href="/projects"
                    label="Projets"
                    icon="/icons/icon-folder-orange.svg"
                    activeIcon="/icons/icon-folder-orange.svg"
                />
            </nav>
            <div className="relative">
                <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={open}
                    onClick={() => setOpen(prev => !prev)}
                    className="flex size-16.25 cursor-pointer items-center justify-center rounded-full bg-brand-light-orange text-sm uppercase tracking-[0.28px] text-neutral-grey-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange"
                >
                    {initials}
                </button>
                {open && (
                    <div role="menu" className="absolute right-0 top-full z-10 mt-2 w-48 rounded-[10px] border border-neutral-grey-200 bg-neutral-white py-2 shadow-[0px_4px_12px_1px_rgba(0,0,0,0.08)]">
                        {/* A form calling a Server Action: works even before the page is hydrated */}
                        <form action={logoutAction}>
                            <button
                                type="submit"
                                role="menuitem"
                                className="w-full cursor-pointer px-4 py-2 text-left text-base text-neutral-grey-950 hover:bg-neutral-grey-50 focus-visible:bg-neutral-grey-50 focus-visible:outline-none"
                            >
                                Se déconnecter
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Menu
