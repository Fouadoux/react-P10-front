import { getTasksOfMonth } from '@/lib/tasks/groups'

// One week of the calendar: always 7 cells, Monday first.
// A cell is the day number (1 to 31), or null when the cell belongs to the previous / next month.
export type CalendarWeek = (number | null)[]

/**
 * Builds the grid of the month that contains `today`, week by week.
 *
 * @param today any date of the month to display (passed in, not read here, so the function stays predictable)
 * @returns     the weeks of the month, each one with 7 cells, Monday first
 *
 * Example: November 2026 starts on a Sunday, so the first week is [null, null, null, null, null, null, 1]
 * and the last one is [30, null, null, null, null, null, null].
 */
export const getMonthGrid = (today: Date): CalendarWeek[] => {
    // Le 1er du mois, et le nombre de jours du mois (28, 29, 30 ou 31)
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()

    // Cases vides avant le 1er. getDay() donne 0 pour dimanche, 1 pour lundi... 6 pour samedi.
    // On veut lundi = 0 case vide ... dimanche = 6 cases vides : (getDay() + 6) % 7 fait exactement ça.
    //   lundi    : (1 + 6) % 7 = 0      mercredi : (3 + 6) % 7 = 2      dimanche : (0 + 6) % 7 = 6
    const blanks = (firstDay.getDay() + 6) % 7

    // Une seule liste à plat : les cases vides, puis les jours 1, 2, 3... jusqu'à la fin du mois
    const cells: (number | null)[] = [
        ...Array.from({ length: blanks }, () => null),
        ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ]

    // On complète la dernière semaine avec des cases vides, pour que le total soit un multiple de 7
    while (cells.length % 7 !== 0) cells.push(null)

    // On coupe la liste en morceaux de 7 : un morceau = une semaine
    const weeks: CalendarWeek[] = []
    for (let i = 0; i < cells.length; i += 7) {
        weeks.push(cells.slice(i, i + 7))
    }
    return weeks
}

/**
 * Groups the tasks due during the month of `today` by day of the month.
 * Tasks without a due date, or due in another month, are left out.
 *
 * @param tasks the tasks of the project
 * @param today any date of the month to display
 * @returns     the tasks of each day, keyed by day number (days without task have no entry)
 */
export const groupTasksByDay = <T extends { dueDate: string | null }>(tasks: T[], today: Date): Map<number, T[]> => {
    const tasksByDay = new Map<number, T[]>()
    for (const task of getTasksOfMonth(tasks, today)) {
        // getTasksOfMonth only keeps tasks that have a due date
        const day = new Date(task.dueDate as string).getDate()
        tasksByDay.set(day, [...(tasksByDay.get(day) ?? []), task])
    }
    return tasksByDay
}
