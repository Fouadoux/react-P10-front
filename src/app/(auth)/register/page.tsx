import Image from 'next/image'
import Logo from '@/components/ui/Logo'
import TextLink from '@/components/ui/TextLink'
import RegisterForm from '@/components/auth/RegisterForm'

export const metadata = { title: 'Inscription - Abricot' }

// Server component: static layout, only <RegisterForm/> runs in the browser
export default function RegisterPage() {
    return (
        <main className="flex min-h-screen">
            <section className="flex w-full shrink-0 flex-col items-center justify-between bg-neutral-grey-50 px-6 py-[55px] lg:w-140.5 lg:px-[140px]">
                <Logo />
                <div className="flex w-full flex-col items-center gap-7.5">
                    <h1 className="text-center font-heading text-[40px] font-bold text-brand-dark-orange">Inscription</h1>
                    <RegisterForm />
                </div>
                <p className="flex w-full items-center gap-2.5 text-sm text-black">
                    Déjà inscrit ?
                    <TextLink label="Se connecter" href="/login" />
                </p>
            </section>
            <div className="relative hidden min-w-0 flex-1 lg:block">
                <Image src="/images/login-cover.jpg" alt="" fill sizes="60vw" className="object-cover" priority />
            </div>
        </main>
    )
}
