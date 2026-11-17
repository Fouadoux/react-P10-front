// The backend stores ONE `name` ("Amélie Dupont"), but the "Mon compte" mockup has two fields (Prénom / Nom).
// This file converts between the two shapes.

import { isBlank } from '@/lib/forms/isBlank';

export type NameParts = {
    firstName: string
    lastName: string
}

export const splitName = (name:string | null): NameParts => {
    if (name === null || isBlank(name)) {
        return {firstName: '', lastName: ''}}

    const [firstName, ...rest] = name.trim().split(/\s+/);
    const lastName = rest.join(" ");

    return {firstName, lastName};
}
