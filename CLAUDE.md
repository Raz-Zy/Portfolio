# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build (outputs standalone server, see next.config.js)
npm start        # Serve the production build
npm run lint     # next lint
```

There is no test suite. The project is a single-page Next.js portfolio site.

### Docker

`docker-compose.yml` defines three services (ports 3000/3001/3002) all built from the multi-stage `Dockerfile` (`builder` → `runner`). The runner stage relies on `output: 'standalone'` in `next.config.js`, which bundles a minimal `server.js` plus traced dependencies. `.env.local` is loaded via `env_file`.

## Environment

`.env.local` holds:
- `GITHUB_TOKEN` — server-only; when present, `/api/github` switches to authenticated GitHub endpoints to include private/org repos. Never expose this to the client.
- `NEXT_PUBLIC_GITHUB_USERNAME` — read on both server and client (defaults to `Raz-Zy` in code as a fallback).

## Architecture

Next.js 15 App Router + TypeScript + Tailwind. Path alias `@/*` → `src/*` (see `tsconfig.json`).

### Page composition
`src/app/page.tsx` is the entire site: it renders each section component from `src/sections/` wrapped in an `<section id="...">`. The section `id`s are the anchor targets for navigation, `sitemap.ts`, and scroll-spy. **If you add, remove, or rename a section, keep these in sync:** `page.tsx`, `src/components/Navbar.tsx` (`navItems`), and `src/app/sitemap.ts`.

`src/app/layout.tsx` owns all SEO: `metadata`, `viewport`, OpenGraph/Twitter cards, and inline JSON-LD structured data. Hard-coded canonical domain is `https://tandara.site`. The `<Navbar />` is mounted here, above `{children}`.

### Sections vs. components
- `src/sections/` — large self-contained page sections (Hero, About, Education, Skills, UXUIDesign, GitHub, Experience, Contact). All are `'use client'` and use Framer Motion for entrance animations. Content (bio, skills, experience entries) is hard-coded as arrays/JSX inside each file — there is no CMS or data layer.
- `src/components/` — shared UI (`Navbar`, `DarkModeToggle`).

### Dark mode
Class-based (`darkMode: 'class'` in `tailwind.config.js`). The `dark` class is toggled on `document.documentElement` and persisted to `localStorage.theme`. Note both `Navbar.tsx` and `DarkModeToggle.tsx` independently read/initialize this state — changes to theme logic must stay consistent across both.

### GitHub integration
`src/sections/GitHub.tsx` (client) fetches from the internal proxy route `src/app/api/github/route.ts` (server), which keeps `GITHUB_TOKEN` server-side. The route is a single GET dispatching on a `?endpoint=` query param: `user`, `orgs`, `repos`, `org-repos` (the latter also needs `?org=`). Each branch falls back to public/unauthenticated GitHub endpoints when the token is missing or a request is forbidden. Types for the consumed shapes live in `src/types/github.ts`.

### Contact form
`src/sections/Contact.tsx` has **no server-side send** — `react-hook-form` + `zod` (`contactSchema`) validate the fields client-side, then `onSubmit` builds a `mailto:` link and sets `window.location.href` to open the user's mail client. It also self-imposes a client-side rate limit: the submit time is stored in `localStorage.lastMessageTime` and re-submission is blocked (with a countdown) until the cooldown elapses. There is no backend to receive submissions.

### SEO routes
`src/app/sitemap.ts` and `src/app/robots.ts` are generated via Next's `MetadataRoute`. The sitemap lists the single page plus hash anchors per section.
