/**
 * Tells whether a form field is empty once the spaces around its text are removed.
 *
 * @param value the text typed by the user
 * @returns     true for "" and for "   " (only spaces), false as soon as there is a real character
 */
export const isBlank = (value: string): boolean => value.trim() === ''
