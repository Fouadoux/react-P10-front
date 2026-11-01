import { redirect } from 'next/navigation'

// The app has no landing page: "/" sends the visitor to the dashboard
// (the proxy sends visitors without a session to /login before this page even runs)
export default function Home() {
  redirect('/dashboard')
}
