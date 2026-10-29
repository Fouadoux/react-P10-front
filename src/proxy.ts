import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/lib/auth/constants'

// Pages reachable without being logged in ("/demo" is temporary)
const PUBLIC_PATHS = ['/login', '/register', '/demo']

// Pages that only make sense for visitors: a logged-in user is sent to the dashboard instead
const GUEST_ONLY_PATHS = ['/login', '/register']

// Runs before every matching request. It only checks that the cookie EXISTS (a quick, optimistic filter):
// the real verification happens later, when the page calls the back with the token.
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const hasSession = request.cookies.has(SESSION_COOKIE)
    const isPublicPath = PUBLIC_PATHS.includes(pathname)
    const isGuestOnlyPath = GUEST_ONLY_PATHS.includes(pathname) ;

    // 1. Not logged in on a protected page: go to the login page
    if (!hasSession && !isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 2. Already logged in but on a visitors-only page: go to the dashboard
    if (hasSession && isGuestOnlyPath) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // 3. Everything else: let the request through
    return NextResponse.next()
}

// Skip static files and Next internals: the proxy would only slow them down
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)'],
}
