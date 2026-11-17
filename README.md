# Abricot — front-end

Application web de gestion de projet collaboratif (SaaS). Les utilisateurs créent des projets, y invitent des contributeurs, répartissent des tâches, les commentent, et peuvent demander à une IA de générer une liste de tâches à partir d'une simple description.

Ce dépôt contient le **front-end** (Next.js). Il consomme l'API REST du back-end Abricot (Express + Prisma), qui est un dépôt à part.

## Fonctionnalités

- **Authentification** : inscription, connexion, déconnexion. Le token JWT est stocké dans un cookie `httpOnly` (voir [docs/authentication.md](docs/authentication.md)).
- **Mon compte** : modification du nom, du prénom, de l'e-mail et, en option, du mot de passe.
- **Projets** : création, liste, modification, suppression, ajout et retrait de contributeurs.
- **Tâches** : création, modification, suppression, assignation à plusieurs personnes, statut (À faire, En cours, Terminée), échéance.
- **Commentaires** sur les tâches.
- **Génération de tâches par IA** : depuis un projet, le bouton « IA » ouvre une fenêtre où l'on décrit ce que l'on veut faire. L'IA propose des tâches que l'on relit, modifie ou supprime avant de les ajouter au projet.
- **Tableau de bord** : liste des tâches assignées (les plus urgentes d'abord) et vue Kanban des tâches du mois.
- **Recherche et filtre** : recherche de tâches, filtre par statut dans un projet.

### Rôles

Tous les utilisateurs ont le même compte, mais leurs droits dépendent du projet :

| Rôle dans le projet | Droits |
| --- | --- |
| Administrateur (le créateur) | modifier et supprimer le projet, gérer les contributeurs, créer et supprimer des tâches |
| Contributeur | créer et supprimer des tâches |
| Ni l'un ni l'autre | aucun accès au projet |

Les droits sont vérifiés par le back-end : le front ne fait que masquer ce qui est interdit.

## Prérequis

- **Node.js 20.9 ou plus** (exigé par Next.js 16)
- **Yarn 4** (`corepack enable` suffit, la version est fixée dans `package.json`)
- Le **back-end Abricot** démarré en local (voir ci-dessous)

## Installation

```bash
yarn install
cp .env.example .env.local   # puis remplir les valeurs (voir Configuration)
yarn dev
```

L'application est servie sur http://localhost:3000.

### Le back-end

Le back-end est dans un autre dépôt (`react-P10-backend`). Il écoute sur `http://localhost:8000`, et sa documentation Swagger est sur `/api-docs`. Pour le lancer, suivez son propre README : copier `.env.example` en `.env` (en changeant `JWT_SECRET`), puis `npm install`, `npx prisma generate`, `npx prisma migrate deploy` et `npm run dev`.

## Configuration

Les variables se règlent dans `.env.local`, à la racine (ce fichier est ignoré par Git : ne commitez jamais une clé). Le modèle se trouve dans `.env.example`.

| Variable | Rôle |
| --- | --- |
| `API_URL` | URL du back-end Abricot (`http://localhost:8000` en local) |
| `AI_API_URL` | URL de base du fournisseur d'IA (API compatible OpenAI : OpenAI, Mistral, Groq, OpenRouter, Ollama…) |
| `AI_MODEL` | Nom du modèle à utiliser, par exemple `gpt-4o-mini` |
| `AI_API_KEY` | Clé secrète du fournisseur (facultative pour un modèle local) |
| `AI_RESPONSE_FORMAT` | `json_schema` (défaut), `json_object` ou `none`, selon ce que le fournisseur accepte |

Ces variables ne sont lues que **côté serveur** : n'ajoutez jamais le préfixe `NEXT_PUBLIC_`, il exposerait la clé au navigateur. Relancez `yarn dev` après toute modification. Sans `AI_API_URL` ni `AI_MODEL`, le reste de l'application fonctionne ; seul le bouton « IA » affiche que la génération n'est pas configurée.

## Commandes

| Commande | Effet |
| --- | --- |
| `yarn dev` | serveur de développement |
| `yarn build` | build de production |
| `yarn start` | lance le build de production |
| `yarn lint` | vérifie le code avec ESLint |
| `npx tsc --noEmit` | vérifie les types TypeScript |

## Technologies et justification des librairies

Le projet n'a volontairement que **trois dépendances de production**.

| Librairie | Pourquoi |
| --- | --- |
| `next` (16, App Router) | imposé par les spécifications. Rendu côté serveur, routes, Server Actions (les formulaires appellent le back sans écrire d'API intermédiaire) |
| `react` / `react-dom` (19) | imposé par les spécifications. `useActionState` gère l'état des formulaires |
| `tailwindcss` (4) et `@tailwindcss/turbopack` | mise en forme par classes utilitaires, sans fichier CSS à maintenir. Les couleurs de la maquette sont des variables dans `globals.css` |
| `typescript` | typage strict (pas de `any`) : une réponse du back mal comprise est une erreur de compilation |
| `eslint` et `eslint-config-next` | règles de qualité du code, dont l'accessibilité (`jsx-a11y`) |

La validation de la réponse de l'IA est écrite à la main (`src/lib/ai/schema.ts`), sans librairie de validation.

## Architecture

```
src/
  app/                      routes (App Router)
    (auth)/                   login, register
    (app)/                    pages connectées : dashboard, projects, account
    actions/                  Server Actions : auth, projects, tasks, comments, account, ai
    api/logout/               suppression du cookie après un token refusé
  components/
    ui/                       éléments réutilisables : Button, TextField, Modal, ModalDialog…
    layout/                   menu, pied de page
    dashboard/, tasks/        vues du tableau de bord
    account/                  page « Mon compte »
    projects/                 page projet et liste
      manage/                   création, modification, suppression du projet
      contributors/             gestion des contributeurs
      tasks/                    tâches, commentaires, filtres, formulaires
      ai/                       génération de tâches par l'IA
  lib/
    api/                      client HTTP vers le back (apiFetch, authFetch)
    auth/                     session (cookie), utilisateur courant
    ai/                       prompt, appel au fournisseur, validation de la réponse
    projects/, tasks/, users/ accès aux données et petites fonctions pures
  types/                    types de l'API (User, Project, Task…)
  proxy.ts                  redirections selon la présence du cookie
```

Principes à retenir :

- **Les données sont lues côté serveur** (composants serveur) et les écritures passent par des **Server Actions**. Le navigateur ne parle jamais directement au back et ne voit jamais le token.
- Une lecture dépendant de la requête (cookie, URL) doit être dans un `<Suspense>` (le projet utilise `cacheComponents`).
- `apiFetch` appelle le back et renvoie toujours la même enveloppe `{ success, data | message }`. `authFetch` y ajoute le token, et redirige vers la déconnexion si le back répond 401.

### Génération de tâches par IA

1. L'utilisateur décrit ses besoins dans la fenêtre « IA » d'un projet.
2. La Server Action `generateTasksAction` vérifie l'accès au projet, construit le prompt (nom et description du projet, date du jour, titres des tâches existantes, texte saisi) et appelle le fournisseur configuré.
3. La réponse est **toujours revalidée** (`parseGeneratedTasks`) : longueurs, statuts, dates dans le passé. Une échéance absente devient une date à renseigner.
4. L'utilisateur relit la liste (modifier, supprimer, ajouter à la main), puis `addGeneratedTasksAction` crée les tâches dans le projet.

Le texte de l'utilisateur est traité comme une donnée et non comme une consigne (protection contre l'injection de prompt), et seules les informations utiles quittent le serveur : aucun membre, aucun identifiant.

## Accessibilité

Le projet vise WCAG 2.1 niveau AA : modales basées sur `<dialog>` (focus et touche Échap gérés par le navigateur), champs avec libellés, messages d'erreur annoncés (`role="alert"`), navigation au clavier avec focus visible, textes alternatifs, autocomplétion des champs de compte. Un audit complet reste à faire (voir ci-dessous).

## Ce qu'il reste à faire

- [ ] **Vue Calendrier** de la page projet, sur le mois en cours. Le bouton existe dans la maquette mais est désactivé, et il n'y a pas de maquette de la vue.
- [ ] **Responsive** (ordinateur, tablette, mobile) : peu de points de rupture et beaucoup de largeurs fixes (menu, tableau de bord, page projet).
- [ ] **Audit d'accessibilité** : contrastes (orange `#d3590b` avec du texte blanc, certains gris), gestion du focus dans les modales imbriquées, bouton grisé qui n'explique pas pourquoi.
- [ ] **Tester dans le navigateur** la page « Mon compte » et la génération par IA avec un vrai fournisseur.
- [ ] Le lien « Mot de passe oublié ? » de la page de connexion mène à `/forgot-password`, qui n'existe pas.
- [ ] Supprimer `public/images/login-cover.jpg`, qui n'est plus utilisée.
- [ ] Facultatif : filtres supplémentaires (assigné à, date d'échéance), tests automatisés.
