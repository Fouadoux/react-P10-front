import Image from 'next/image'
import Logo from '@/components/ui/Logo'
import TextLink from '@/components/ui/TextLink'
import LoginForm from '@/components/auth/LoginForm'

export const metadata = { title: 'Connexion - Abricot' }

// Server component: static layout, only <LoginForm/> runs in the browser
export default function LoginPage() {
    return (
        <main className="flex min-h-screen">
            <section className="flex w-full shrink-0 flex-col items-center justify-between bg-neutral-grey-50 px-6 py-[55px] lg:w-140.5 lg:px-[140px]">
                <Logo />
                <div className="flex w-full flex-col items-center gap-7.5">
                    <h1 className="text-center font-heading text-[40px] font-bold text-brand-dark-orange">Connexion</h1>
                    <LoginForm />
                    <TextLink label="Mot de passe oublié?" href="/forgot-password" />
                </div>
                <p className="flex w-full items-center gap-2.5 text-sm text-black">
                    Pas encore de compte ?
                    <TextLink label="Créer un compte" href="/register" />
                </p>
            </section>
            <div className="relative hidden min-w-0 flex-1 lg:block">
                <Image src="/images/login-cover.jpg" alt="" fill sizes="60vw" className="object-cover" priority />
            </div>
        </main>
    )
}
