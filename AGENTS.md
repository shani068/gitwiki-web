<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# GitWiki Web

Next.js 16 App Router client for GitWiki. Its API is the sibling repo `../git-wiki-backend`. Architecture, conventions and the add-a-feature checklist are in [README.md](README.md); follow them.

## Tooling

- Bun only: `bun add`, `bunx`. Never npm/npx.
- Verify changes with `bunx tsc --noEmit` and `bun lint`. There is no test suite.

## Skills

Before starting any task, find the skills that apply and follow them while you implement.

1. Check the installed skills in `.claude/skills/` (Claude Code) or `.agents/skills/` (other agents). Both folders hold the same skills.
2. Use the `find-skills` skill on every task to find relevant skills, including cross-cutting ones such as web security and accessibility. Use `bunx skills`, not `npx`.
3. Ask before installing a new skill. Install it into this project (`bunx skills add <owner/repo@skill>`, without `-g`) so `.claude/`, `.agents/` and `skills-lock.json` stay in sync.

## Rules

- Use current APIs for React 19, Zod 4, TanStack Query 5 and Tailwind 4. Tailwind is configured in CSS (`app/globals.css`); there is no `tailwind.config`.
- All HTTP goes through `api` in `lib/api.ts`, called from `services/` or the `useFetch` / `usePost`-family hooks. Components never call axios or `fetch` directly.
- UI is built from shadcn/ui components; follow the `shadcn` skill. If `components.json` is missing, run `bunx shadcn@latest init` first, then add what you need with `bunx shadcn@latest add <component>`.
- Don't hand-write UI primitives (buttons, inputs, dialogs, etc.). Feature components in `components/features/` only compose shadcn components.
- `shadcn add` writes into `components/ui/` and overwrites the old hand-written `button.tsx` / `input.tsx`. Update their callers, e.g. the `loading` prop on `Button`.
