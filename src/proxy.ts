import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/lib/auth/constants'

// Pages reachable without being logged in ("/demo" is temporary)
const PUBLIC_PATHS = ['/login', '/register', '/demo']

// Runs before every matching request. It only checks that the cookie EXISTS (a quick, optimistic filter):
// the real verification happens later, when the page calls the back with the token.
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const hasSession = request.cookies.has(SESSION_COOKIE)
    const isPublicPath = PUBLIC_PATHS.includes(pathname)

    // TODO(human): décide où envoyer le visiteur (6-8 lignes)
    //  Trois cas à traiter (à toi de les ordonner et de renvoyer la bonne réponse) :
    //   1. pas de cookie ET page protégée   -> redirige vers /login
    //   2. cookie présent ET page /login ou /register (déjà connecté) -> redirige vers /dashboard
    //   3. tous les autres cas               -> laisse passer la requête
    //  Outils : NextResponse.redirect(new URL('/login', request.url)) et NextResponse.next()
    //  Question : pourquoi faut-il `request.url` comme deuxième argument de new URL(...) ?
}

// Skip static files and Next internals: the proxy would only slow them down
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)'],
}
