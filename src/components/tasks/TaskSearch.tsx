import Image from 'next/image'

type TaskSearchProps = {
    // Text currently searched (from the URL), shown again in the box after the page reloads
    query: string
}

// Search box of the task list. A plain GET form: submitting it reloads /dashboard?q=... (no JavaScript needed)
const TaskSearch = ({ query }: TaskSearchProps) => (
    <form action="/dashboard" role="search" className="flex w-full max-w-[357px] items-center rounded-[10px] border border-neutral-grey-200 bg-neutral-white px-8 py-5">
        <label htmlFor="task-search" className="sr-only">Rechercher une tâche</label>
        <input
            id="task-search"
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Rechercher une tâche"
            className="w-full bg-transparent text-sm text-neutral-grey-950 placeholder:text-neutral-grey-800 focus-visible:outline-none"
        />
        <button type="submit" aria-label="Lancer la recherche" className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark-orange">
            <Image src="/icons/icon-search-grey.svg" alt="" width={14} height={14} />
        </button>
    </form>
)

export default TaskSearch
