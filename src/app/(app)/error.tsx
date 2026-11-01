'use client'

import Button from '@/components/ui/Button'

type ErrorPageProps = {
    // Provided by Next: fetches the page data again and re-renders it
    // (reset() would only re-render with the data that already failed)
    retry: () => void
}

// Shown in place of the page content when something fails while loading it (the menu and footer stay)
const ErrorPage = ({ retry }: ErrorPageProps) => (
    <div className="flex flex-col items-center gap-6 px-6 py-24 text-center">
        <p role="alert" className="text-xl text-neutral-grey-950">Impossible de récupérer vos données.</p>
        <Button label="Réessayer" onClick={retry} />
    </div>
)

export default ErrorPage
