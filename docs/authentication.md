# Authentification

Le token JWT est renvoyé par l'API Express, puis stocké dans un cookie `httpOnly` par une Server Action.
Le navigateur n'a jamais accès au token en JavaScript.

```mermaid
sequenceDiagram
    actor U as Utilisateur
    participant B as Navigateur (LoginForm)
    participant P as proxy.ts
    participant S as Server Action (loginAction)
    participant A as API Express (:8000)

    Note over U,A: 1. Connexion
    U->>B: Saisit email + mot de passe, valide
    B->>S: Soumet le formulaire (Server Action)
    S->>A: POST /auth/login {email, password}
    alt Identifiants invalides
        A-->>S: 401 + message
        S-->>B: {message, success: false}
        B-->>U: Affiche l'erreur (role="alert")
    else Identifiants valides
        A-->>S: 200 {token (JWT)}
        S->>S: setSession(token) : cookie httpOnly, 7 jours
        S-->>B: redirect('/dashboard')
    end

    Note over U,A: 2. Accès à une page protégée
    U->>B: Ouvre /dashboard
    B->>P: GET /dashboard
    alt Pas de cookie
        P-->>B: redirect /login
    else Cookie présent
        P-->>B: NextResponse.next()
        B->>S: Rendu serveur de la page (authFetch lit le cookie)
        S->>A: GET /... (Authorization: Bearer token)
        A-->>S: 200 + données
        S-->>B: Page rendue
    end

    Note over U,A: 3. Déjà connecté sur /login ou /register
    U->>B: Ouvre /login
    B->>P: GET /login
    P-->>B: Cookie présent, redirect /dashboard

    Note over U,A: 4. Token expiré ou invalide
    B->>S: Rendu d'une page protégée
    S->>A: GET /... (Bearer token expiré)
    A-->>S: 401
    S-->>B: redirect('/api/logout')
    B->>S: GET /api/logout (Route Handler)
    S->>S: clearSession() : supprime le cookie
    S-->>B: redirect('/login')

    Note over U,A: 5. Déconnexion volontaire
    U->>B: Clique sur « Déconnexion »
    B->>S: logoutAction
    S->>S: clearSession()
    S-->>B: redirect('/login')
```

## Points clés

- **Le proxy ne vérifie que la présence du cookie**, pas sa validité : c'est le back-end qui juge le token (cas 4).
- **Détour par `/api/logout`** : un Server Component ne peut pas supprimer un cookie, seuls un Route Handler ou une Server Action le peuvent.
- **Cookie `httpOnly`** : le token n'est pas lisible par le JavaScript du navigateur, ce qui limite l'impact d'une faille XSS.
- L'inscription (`registerAction`) suit le cas 1, avec `POST /auth/register`.

## Fichiers concernés

| Rôle | Fichier |
| --- | --- |
| Redirections selon le cookie | `src/proxy.ts` |
| Login, inscription, déconnexion | `src/app/actions/auth.ts` |
| Lecture / écriture / suppression du cookie | `src/lib/auth/session.ts` |
| Appels API (gestion du 401) | `src/lib/api/client.ts` |
| Suppression du cookie après un 401 | `src/app/api/logout/route.ts` |
