# GitWiki Web

The web app for **GitWiki**, a tool that turns a GitHub repository into a readable, searchable wiki.

Here you browse your repositories, open a generated wiki, and read its pages, with every page linked back to the file and commit it came from. The app talks to [gitwiki-api](https://github.com/shani068/gitwiki-api) for accounts and data.

---

## Table of Contents

- [Key Features](#key-features)
- [Project Status](#project-status)
- [Pages](#pages)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [How Data Flows](#how-data-flows)
- [Development Workflow](#development-workflow)
- [License](#license)

---

## Key Features

**Repository library** (`/wikis`)
- Lists repositories with their index status: *Indexed*, *Indexing*, or *Index failed* (with the reason).
- Shows page count, source commit, and when each repository was last indexed.
- Filter the list as you type.
- Add a repository by entering `owner/repo` or a `github.com` URL.

**Wiki reader** (`/wikis/:owner/:repo`)
- Page tree grouped into sections, always visible on desktop and in a slide-out menu on mobile.
- Search across page titles and headings with <kbd>⌘</kbd> <kbd>K</kbd>, <kbd>Ctrl</kbd> <kbd>K</kbd>, or <kbd>/</kbd>.
- "On this page" outline that highlights the section you are reading.
- Markdown rendering with tables, heading anchors, and syntax-highlighted code blocks with a copy button.
- Breadcrumbs, previous/next links, and links to the source file and commit on GitHub.
- Clear loading, not-found, still-indexing, and failed states.

**General**
- Light, dark, and system themes.
- Sign-in, registration, dashboard, and settings screens.

---

## Project Status

The project is in active development. The wiki reader is complete, but it runs on **built-in sample data** until the backend serves wiki pages.

| Area | Status |
| --- | --- |
| Landing page, theme switching | ✅ Working |
| Repository library and wiki reader | ✅ Working with sample data (default) |
| Wiki reader against the real API | ⏳ Ready in the client; the backend `/api/v1/wikis` endpoints don't exist yet |
| Sign-in and registration forms | ⏳ UI done; they call `/auth/login` and `/auth/register`, which don't match the backend's Better Auth routes (`/api/auth/sign-in/email`, `/api/auth/sign-up/email`) |
| Settings form | ⏳ UI done; sends `PATCH /users/me`, while the backend exposes `PUT /api/v1/users/me` |
| Dashboard | ⏳ Stats and "Recent Users" show placeholder data |
| Route protection | ❌ Not implemented; all pages are publicly reachable |

The sample data contains three repositories: `shani068/gitwiki-api` (ready, with 7 pages), `shani068/gitwiki-web` (indexing), and `shani068/infra-notes` (failed). Open **Browse wikis** on the home page to try them.

---

## Pages

| Route | Description |
| --- | --- |
| `/` | Landing page |
| `/login` | Sign-in form |
| `/register` | Registration form |
| `/dashboard` | Dashboard overview (placeholder data) |
| `/settings` | Profile settings form |
| `/wikis` | Repository library |
| `/wikis/:owner/:repo` | A repository's wiki, opened on its first page |
| `/wikis/:owner/:repo/:slug…` | A specific wiki page, e.g. `/wikis/shani068/gitwiki-api/architecture/indexing-pipeline` |

---

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI library | React 19 |
| Language | TypeScript |
| Styling | [Tailwind CSS 4](https://tailwindcss.com), configured in `app/globals.css` (no `tailwind.config`) |
| Components | [shadcn/ui](https://ui.shadcn.com) on Radix UI, with [Lucide](https://lucide.dev) icons |
| Server state | [TanStack Query 5](https://tanstack.com/query) |
| HTTP client | Axios |
| Validation | Zod 4 |
| Markdown | react-markdown, remark-gfm, rehype-slug, rehype-highlight |
| Search palette | cmdk |
| Theming | next-themes |
| Fonts | IBM Plex Sans and JetBrains Mono (via `next/font`) |
| Tooling | Bun, ESLint 9, Prettier (with the Tailwind plugin) |

---

## Project Structure

```
git-wiki-frontend/
├── app/                         # Routes (Next.js App Router)
│   ├── layout.tsx               # Root layout: fonts, metadata, providers
│   ├── page.tsx                 # Landing page (/)
│   ├── globals.css              # Tailwind setup and theme colors
│   ├── error.tsx, not-found.tsx # Global error and 404 pages
│   ├── (auth)/                  # /login, /register
│   ├── (dashboard)/             # /dashboard, /settings (sidebar + navbar layout)
│   └── (wiki)/wikis/            # /wikis and /wikis/[owner]/[repo]/[[...slug]]
├── components/
│   ├── ui/                      # shadcn/ui components (generated, don't hand-write)
│   ├── layout/                  # Navbar, sidebar, theme toggle
│   └── features/
│       ├── auth/                # Login and register forms
│       ├── dashboard/           # Stats, recent users, settings form
│       └── wiki/                # Library, reader shell, nav, search, article, TOC…
├── hooks/
│   ├── useFetch.ts              # Generic GET hook (TanStack Query)
│   ├── useApi.ts                # usePost / usePut / usePatch / useDelete / useUpload
│   └── useWiki.ts               # Wiki queries and the "index repository" mutation
├── services/                    # API calls: auth, user, wiki
├── lib/
│   ├── api.ts                   # Shared Axios instance (redirects to /login on 401)
│   ├── auth.ts                  # Session helpers (localStorage)
│   ├── validations/             # Zod schemas for forms
│   └── wiki/                    # Navigation and heading helpers, errors, sample data
├── providers/                   # Theme, TanStack Query, and tooltip providers
├── constants/                   # App config and route map
├── types/                       # Shared TypeScript types (API, auth, wiki)
├── utils/                       # cn, date formatting, error messages
├── public/                      # Static files
├── components.json              # shadcn/ui configuration
└── AGENTS.md                    # Conventions for AI coding agents (and humans)
```

Folders in parentheses, such as `(auth)`, are **route groups**: they share a layout but don't appear in the URL.

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) 1.0 or newer
- Optional: the [GitWiki API](https://github.com/shani068/gitwiki-api) running locally. The wiki reader works without it using sample data.

### 1. Install

```bash
git clone https://github.com/shani068/gitwiki-web.git
cd gitwiki-web
bun install
```

### 2. Configure (optional)

Create a `.env.local` file in the project root if you need to change the defaults (see [Environment Variables](#environment-variables)):

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Run

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Running with the backend?** The API also uses port `3000` by default. Start the API first, then run the web app on another port:
>
> ```bash
> bun dev --port 3001
> ```
>
> Then open [http://localhost:3001](http://localhost:3001).

---

## Environment Variables

Both variables are optional. Because they start with `NEXT_PUBLIC_`, they are included in the browser bundle, so never put secrets in them.

| Variable | Default | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000` | Base URL of the GitWiki API. |
| `NEXT_PUBLIC_WIKI_SOURCE` | `fixtures` | Where wiki data comes from. Leave unset to use the built-in sample data; set to `api` to call the backend. |

After changing `.env.local`, restart `bun dev`.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `bun dev` | Start the development server with hot reload |
| `bun run build` | Create an optimized production build |
| `bun start` | Serve the production build (run `bun run build` first) |
| `bun lint` | Check code with ESLint |
| `bunx tsc --noEmit` | Type-check the project |

Use `bun run build`, not `bun build`: the latter runs Bun's own bundler instead of the project's build script.

There is no automated test suite yet.

---

## How Data Flows

```
Component  →  hook (hooks/)  →  service (services/)  →  api (lib/api.ts)  →  GitWiki API
```

- **Components** never call Axios or `fetch` directly.
- **Hooks** wrap services with TanStack Query for caching, loading states, and retries.
- **Services** hold the actual API calls and can be used outside React.
- **`lib/api.ts`** is the single Axios instance. It sends cookies (`withCredentials`) and redirects to `/login` when the API returns `401`.

### Wiki data source

`services/wiki.service.ts` switches on `NEXT_PUBLIC_WIKI_SOURCE`:

- **`fixtures` (default):** reads sample data from `lib/wiki/fixtures/`. It simulates network latency and "not found" errors so every loading and error state can be seen without a backend.
- **`api`:** calls the backend. These are the endpoints the client expects, each wrapped in the API's standard `{ data, message, success }` envelope:

| Method | Endpoint | Returns |
| --- | --- | --- |
| GET | `/api/v1/wikis` | `WikiRepository[]` |
| GET | `/api/v1/wikis/:owner/:repo` | `WikiDetail` (repository + page tree) |
| GET | `/api/v1/wikis/:owner/:repo/pages/:slug` | `WikiPage` (Markdown content + metadata) |
| POST | `/api/v1/wikis` with body `{ "repo": "owner/repo" }` | `WikiRepository` |

The data shapes are defined in `types/wiki.d.ts`.

---

## Development Workflow

### Adding a feature

1. **Types:** `types/<feature>.d.ts`
2. **Validation:** `lib/validations/<feature>.schema.ts`
3. **Service:** `services/<feature>.service.ts`, using `api` from `lib/api.ts`
4. **Hook** (if needed): `hooks/use<Feature>.ts`
5. **Components:** `components/features/<feature>/`, composed from shadcn/ui components
6. **Page:** `app/(dashboard)/<feature>/page.tsx`, or another route group
7. Add the route to `constants/routes.ts`

### Adding UI components

UI building blocks come from shadcn/ui. Add new ones with the CLI instead of writing them by hand:

```bash
bunx shadcn@latest add <component>
```

This writes to `components/ui/`. Feature components should only compose these.

### Conventions

| Topic | Convention |
| --- | --- |
| Package manager | Bun only (`bun add`, `bunx`), not npm/npx |
| File names | `kebab-case` (`login-form.tsx`, `wiki.service.ts`); hooks are `useCamelCase.ts` |
| Exports | Named exports, except `page.tsx` and `layout.tsx` |
| Services | Exported as an object, e.g. `export const wikiService = { … }` |
| Constants | `UPPER_SNAKE_CASE` |
| Types | `interface` for objects, `type` for unions |
| Components | Server Components by default; add `"use client"` only for interactive parts |
| Routes | Use `ROUTES` and `wikiPath()` from `constants/routes.ts` instead of hard-coded paths |

Before committing, run `bunx tsc --noEmit` and `bun lint`.

This project uses Next.js 16, which changes some APIs from earlier versions. When in doubt, check the docs bundled in `node_modules/next/dist/docs/`. See [AGENTS.md](AGENTS.md) for more rules.

---

## License

MIT
