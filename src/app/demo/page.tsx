'use client'

import { useState } from 'react'
import Logo from '@/components/ui/Logo'
import Button from '@/components/ui/Button'
import TextField from '@/components/ui/TextField'
import TextLink from '@/components/ui/TextLink'
import Footer from '@/components/layout/Footer'

// Temporary page to check the migrated components (delete once the real pages exist)
export default function DemoPage() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  return (
    <div className="flex min-h-screen flex-col bg-neutral-grey-50">
      <main className="flex flex-1 flex-col items-start gap-6 p-10">
        <Logo />
        <div className="flex w-96 flex-col gap-4">
          <TextField label="Email" name="email" type="email" autoComplete="email" value={email} onChange={setEmail} />
          <TextField label="Mot de passe" name="password" type="password" autoComplete="current-password" value={password} onChange={setPassword} />
          <Button label="Se connecter" type="submit" />
          <Button label="Désactivé" disabled />
          <TextLink label="Mot de passe oublié?" href="/forgot-password" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
