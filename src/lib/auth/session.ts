import { cookies } from 'next/headers'
import { SESSION_COOKIE } from './constants'

// Reads the JWT from the request's cookies (server side only)
export const getToken = async (): Promise<string | null> => {
    const cookieStore = await cookies()
    return cookieStore.get(SESSION_COOKIE)?.value ?? null
}

export const setSession = async (token: string): Promise<void> => {
    const cookieStore = await cookies()
    // TODO(human): enregistre le token dans un cookie nommé SESSION_COOKIE (1 appel à cookieStore.set, 5-7 lignes)
    //  Ce cookie remplace le localStorage de Vite : c'est lui qui prouve au serveur que l'utilisateur est connecté.
    //  Les options sont des choix de sécurité, à toi de les décider :
    //   - httpOnly : le JavaScript du navigateur peut-il lire ce cookie ? (pense au XSS dont on a parlé)
    //   - secure : cookie envoyé seulement en HTTPS ? Mais en local on est en HTTP... (indice : process.env.NODE_ENV)
    //   - sameSite : 'lax' ou 'strict' ? (protège contre les requêtes envoyées depuis un autre site)
    //   - path : '/' pour que tout le site le reçoive
    //   - maxAge : combien de secondes dure la session ? (7 jours = 60 * 60 * 24 * 7)
    cookieStore.set(SESSION_COOKIE,token,{
        httpOnly:true,
        maxAge: 60 * 60 * 24 * 7,
        secure:process.env.NODE_ENV==='production',
        sameSite:'lax',
        path: '/',
    })
}

export const clearSession = async (): Promise<void> => {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE)
}
