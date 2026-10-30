// The two ways to look at the dashboard tasks (chosen with the tabs, stored in the URL: /dashboard?view=kanban)
export type DashboardView = 'list' | 'kanban'

/**
 * Turns the `view` value found in the URL into a valid dashboard view.
 *
 * @param rawView what the URL contains after "?view=" (any text, or undefined when absent)
 * @returns       the view to display
 */
export const getDashboardView = (rawView: string | undefined): DashboardView => {
    if (rawView === 'kanban') return 'kanban'
    return 'list'
}
