# Movie Search App

Discover and explore movies with fast client caching, predictive prefetching, and URL‑synced search state.

**Live demo:** [https://movie-search.christse.dev](https://movie-search.christse.dev)

## Quick Start
Install & dev (Bun):
```bash
bun install
bun run dev
```

Build:
```bash
bun run build
```

Format:
```bash
bun run fmt
```

(Also works with `npm`, `pnpm`, or `yarn`)


## Highlights
- Hybrid REST+GraphQL usage
  - Use REST where it makes sense and GraphQL to avoid overfetching where possible
- Predictive prefetch
  - Hover prefetch for pages & detail, parallel genre priming.
- URL-driven state
  - URL as source of truth
  - Allows easy link sharing
  - Refreshing puts you back where you were
- Accessibility & UX
  - Focus trap and restore from dialog
  - Keyboard navigation
- Performance touches
  - Placeholder reuse
  - Bounded retries
  - React compiler removes need for manual `memo()` and `useCallback` 



## Tech Stack

React 19, Vite (rolldown + react compiler), TypeScript, [TanStack Query](https://tanstack.com/query/latest), [nuqs](https://nuqs.dev), Tailwind, [shadcn/ui](https://ui.shadcn.com/), [Zod Mini](https://zod.dev/packages/mini), iso8601-duration.

## Architecture

A single‑page React 19 + Vite app using TanStack Query for data orchestration, REST + GraphQL hybrid API integration, and URL‑driven client routing via nuqs.

Prefetching and debounced queries keep the app feeling instantaneous without server rendering.

## Folder Structure

```
src/
  app.tsx
  main.tsx
  components/
    ui/                # shadcn/ui generated
    movie-search.tsx   # Core search & pagination logic
    movie-card.tsx
    movie-detail-dialog.tsx
    explore-sections.tsx
    search-bar.tsx
    rating-stars.tsx
    loading-shell.tsx
    header.tsx
  features/
    movies/queries.ts  # movies-related queries
    genres/queries.ts  # genre-related queries
    healthcheck/queries.ts
    history.ts         # pushState helper
  hooks/
    use-debounce.ts
    use-prefetch-page.ts
  lib/
    api/{auth,rest,graphql,const}.ts  # network fetching helpers
    query/client.ts
    utils.ts
```

## Attribution

Borrowed / Generated:
- `components/ui/*` shadcn/ui base components
- `lib/utils.ts` `cn` helper pattern
- `hooks/use-debounce.ts` standard debounce hook pattern
- `rating-stars.tsx` rating half‑star masking (AI-assistance)
- Most UI layouts were mocked via AI-assistance

## Known Trade-offs

- API Token
  - Currently just fetched if not in localStorage and re-used
  - It wasn't specified, but if this was meant to be an app-level API key, then fetches should be proxied
  - Otherwise, this is essentially treated as a user-level API key
- Full SPA App
  - SSR did not seem necessary for this app, but can be used for faster initial response
- Client-side fetching
  - In production, a small Next.js or serverless proxy would handle `/auth/token` exchange and forward requests with secure credentials.  
  - Separates external service tokens and allows for rate‑limiting and server‑side caching.

## Next Improvements

Some things I'd implement given more time:

- *Advanced filtering*
  - Year ranges
  - Multi-genre
  - Min/max rating
- *Robust data persistence*
  - Use Tanstack Query persistQueryClient
- *Smarter prefetching*
  - Prefetch pages when approaching, scrolled to bottom, etc., not just mouseenter on pagination buttons
  - Prefetch genres within some distance of the item, or when hovering +/- n items away
- *Infinite scroll + virtualization option*
- *Testing*
- *Error boundaries*