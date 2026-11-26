import { getMonthGrid, groupTasksByDay } from '@/lib/tasks/calendar'
import { STATUS_CLASSES, STATUS_LABELS } from '@/lib/tasks/labels'
import type { ProjectTask } from '@/types'

type TaskCalendarProps = {
    // The tasks to show (already filtered by the search box and the status dropdown)
    tasks: ProjectTask[]
    // The current date, given by the server so that the month is the same on both sides
    today: Date
}

// Full names (read by screen readers) and short names (shown) of the columns, Monday first
const WEEKDAYS = [
    { long: 'lundi', short: 'Lun' },
    { long: 'mardi', short: 'Mar' },
    { long: 'mercredi', short: 'Mer' },
    { long: 'jeudi', short: 'Jeu' },
    { long: 'vendredi', short: 'Ven' },
    { long: 'samedi', short: 'Sam' },
    { long: 'dimanche', short: 'Dim' },
]

// Calendar view of the project's tasks: one table for the current month, each task written in the cell of its due day.
// Tasks without a due date, or due in another month, cannot sit in the grid: they are listed under it.
const TaskCalendar = ({ tasks, today }: TaskCalendarProps) => {
    const weeks = getMonthGrid(today)
    const tasksByDay = groupTasksByDay(tasks, today)
    const monthLabel = today.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    const tasksWithoutDay = tasks.filter(task => !task.dueDate)
    const tasksOfOtherMonths = tasks.length - tasksWithoutDay.length - [...tasksByDay.values()].flat().length

    return (
        <div className="flex flex-col gap-6">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] table-fixed border-collapse">
                    <caption className="pb-4 text-left text-lg capitalize text-neutral-grey-950">{monthLabel}</caption>
                    <thead>
                        <tr>
                            {WEEKDAYS.map(({ long, short }) => (
                                <th
                                    key={long}
                                    scope="col"
                                    className="border border-neutral-grey-200 bg-neutral-grey-50 px-2 py-3 text-sm font-normal text-neutral-grey-800"
                                >
                                    <abbr title={long} className="no-underline">{short}</abbr>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {weeks.map((week, weekIndex) => (
                            <tr key={weekIndex}>
                                {week.map((day, dayIndex) => {
                                    // An empty cell: the day belongs to the previous or the next month
                                    if (day === null) {
                                        return <td key={dayIndex} className="h-28 border border-neutral-grey-200 bg-neutral-grey-50" />
                                    }
                                    const date = new Date(today.getFullYear(), today.getMonth(), day)
                                    const isToday = day === today.getDate()
                                    const dayTasks = tasksByDay.get(day) ?? []
                                    return (
                                        <td
                                            key={dayIndex}
                                            aria-current={isToday ? 'date' : undefined}
                                            className="h-28 border border-neutral-grey-200 bg-neutral-white p-2 align-top"
                                        >
                                            <time
                                                dateTime={`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`}
                                                className={`mb-2 flex size-6 items-center justify-center rounded-full text-xs ${isToday ? 'bg-brand-dark-orange text-neutral-white' : 'text-neutral-grey-800'}`}
                                            >
                                                {/* Screen readers get the full date, sighted users the day number */}
                                                <span aria-hidden="true">{day}</span>
                                                <span className="sr-only">
                                                    {date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                </span>
                                            </time>
                                            {dayTasks.length > 0 && (
                                                <ul className="flex flex-col gap-1">
                                                    {dayTasks.map(task => (
                                                        <li
                                                            key={task.id}
                                                            title={task.title}
                                                            className={`truncate rounded-[4px] px-2 py-1 text-xs ${STATUS_CLASSES[task.status]}`}
                                                        >
                                                            {/* The status is also given by the color: say it in words too */}
                                                            <span className="sr-only">{STATUS_LABELS[task.status]} : </span>
                                                            {task.title}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {tasksWithoutDay.length > 0 && (
                <section aria-labelledby="calendar-no-due-date" className="flex flex-col gap-2">
                    <h3 id="calendar-no-due-date" className="text-base text-neutral-grey-950">Sans échéance</h3>
                    <ul className="flex flex-wrap gap-2">
                        {tasksWithoutDay.map(task => (
                            <li key={task.id} className={`rounded-[4px] px-3 py-1 text-xs ${STATUS_CLASSES[task.status]}`}>
                                <span className="sr-only">{STATUS_LABELS[task.status]} : </span>
                                {task.title}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {tasksOfOtherMonths > 0 && (
                <p className="text-sm text-neutral-grey-500">
                    {tasksOfOtherMonths === 1
                        ? '1 autre tâche est prévue un autre mois : elle est visible dans la vue Liste.'
                        : `${tasksOfOtherMonths} autres tâches sont prévues un autre mois : elles sont visibles dans la vue Liste.`}
                </p>
            )}
        </div>
    )
}

export default TaskCalendar
