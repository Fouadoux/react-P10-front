import Image from 'next/image'
import Logo from '@/components/ui/Logo'
import TextLink from '@/components/ui/TextLink'
import LoginForm from '@/components/auth/LoginForm'

export const metadata = { title: 'Connexion - Abricot' }

// Server component: static layout, only <LoginForm/> runs in the browser
export default function LoginPage() {
    return (
        <main className="relative flex min-h-screen">
            <section className="relative z-10 flex w-full shrink-0 flex-col items-center justify-between bg-neutral-grey-50 px-6 py-[55px] lg:w-140.5 lg:px-[140px]">
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
            {/* The photo is the background of the whole page; the form section above covers its left part */}
            <div className="absolute inset-0 hidden lg:block">
                <Image src="/images/login-cover.png" alt="" fill sizes="100vw" className="object-cover" priority />
            </div>
        </main>
    )
}
