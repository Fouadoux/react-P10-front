// Name of the cookie holding the JWT. Kept in its own file so both session.ts (server code)
// and proxy.ts can import it without pulling in next/headers.
export const SESSION_COOKIE = 'token'
