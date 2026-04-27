# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Next.js 16 (App Router) + React 19 + TypeScript (strict). Tailwind CSS v4 via `@tailwindcss/postcss`. Data: axios + TanStack Query. Path alias `@/*` → `src/*`.

This is the **frontend** for the `budgeting-app` Rails API (sibling repo). The Rails backend lives at `localhost:3001` by default; this app runs on `localhost:3000`.

## Commands

```bash
npm run dev      # next dev — http://localhost:3000
npm run build    # next build (production)
npm run start    # next start (serve a built app)
npm run lint     # eslint (next/core-web-vitals + next/typescript)
```

There is no test runner configured.

## Environment

`.env.local` must define `NEXT_PUBLIC_API_URL` pointing at the Rails API (default `http://localhost:3001`). It's read by [src/lib/api/axiosInstance.ts](src/lib/api/axiosInstance.ts).

## Architecture

### App Router layout

```
src/app/
  layout.tsx       # html/body shell, wraps in <Providers>
  providers.tsx    # QueryClientProvider + AuthProvider
  page.tsx         # "/" — dashboard (uses TanStack Query)
  login/           # "/login"
  signup/          # "/signup"
  expenses/
    page.tsx       # "/expenses" — list
    new/page.tsx   # "/expenses/new" — create form
    [id]/page.tsx  # "/expenses/:id" — show
```

All page components are `"use client"` — there is no server-side data fetching here; everything goes through the API client at runtime.

### Auth flow (JWT in localStorage)

1. [AuthContext](src/context/AuthContext.tsx) exposes `login`, `signup`, `logout`, plus `user`/`loading`/`error` state. Wrapped around the app in [providers.tsx](src/app/providers.tsx).
2. [src/lib/api/auth.ts](src/lib/api/auth.ts) hits `POST /api/v1/login` and `POST /api/v1/signup`, then **reads the JWT from the `Authorization` response header** (`Bearer <token>`) and stashes it in `localStorage` under the key `token`. Logout calls `DELETE /api/v1/logout` and removes it.
3. [axiosInstance](src/lib/api/axiosInstance.ts) attaches `Authorization: Bearer <token>` from `localStorage` on every request via a request interceptor.

Implications:
- Auth is **client-only**. There is no Next.js middleware guarding routes — pages won't SSR-redirect unauthenticated users; they'll just fail their API calls.
- `localStorage` access means anything reading the token must run in the browser. Don't move auth-aware code into a Server Component.
- The Rails backend dispatches JWTs on `POST /api/v1/log_in` per its Devise config — the frontend uses `/login` and `/signup` paths (Devise's `path_names` aliases). Keep these in sync if backend routes change.

### Data layer — two patterns coexist (be deliberate)

The codebase has **two parallel patterns** for fetching, and they're not consistent. When adding new data:

- **TanStack Query** (preferred for new code): used in [src/app/page.tsx](src/app/page.tsx) for the dashboard. `QueryClient` is provisioned in [providers.tsx](src/app/providers.tsx).
- **Hand-rolled `useState` + `useEffect` hooks**: [useExpenses](src/hooks/useExpenses.ts), [useFriends](src/hooks/useFriends.ts), [useGroups](src/hooks/useGroups.ts), [useCategories](src/hooks/useCategories.ts). These don't cache, don't dedupe, and don't refetch — every mount hits the API. Migrating these to `useQuery` is low-risk cleanup.

API call functions live in [src/lib/api/](src/lib/api/) — one file per resource (`expenses.ts`, `friends.ts`, `groups.ts`, `categories.ts`, `home.ts`, `auth.ts`). Each function returns a typed promise.

### Backend response shape (JSON:API)

The Rails backend uses `jsonapi-serializer`, so most responses look like:

```ts
{ data: { id: string, attributes: {...}, relationships: {...} } }
// or
{ data: [{...}], meta: { current_page, total_pages, ... } }
```

That's why types like [Expense](src/types/expense.ts) wrap everything under `attributes`/`relationships`. When unwrapping, peel off `res.data.data` (note the double `.data` — once for axios, once for JSON:API). The dashboard endpoint (`GET /api/v1/dashboard`) is the exception — it returns a flat object (see [DashboardResponse](src/types/dashboard.ts)).

For paginated lists, `meta` carries pagy info (page size 20 by default backend-side).

### Expense creation — payload shape that matches the backend service

[createExpense](src/lib/api/expenses.ts) wraps the form payload as `{ expense: payload }`. The Rails [ExpenseCreationService](../budgeting-app/app/services/expense_creation_service.rb) requires consistent rules:

- `split_equally: true` → only `participants` user_ids matter; the service computes shares.
- `split_equally: false` with `participants` → each `{ user_id, paid_share, owed_share }` must sum to `amount` on both sides.
- `group_id` (existing) **or** `new_group: { name, group_type }` (creates inline) — not both.
- All non-self participants must already be friends of the current user; otherwise the API returns 422.

[ExpenseCreate.tsx](src/components/expense/ExpenseCreate.tsx) is the canonical example of building this payload.

## Conventions

- All page-level components are `"use client"`.
- Tailwind utility classes inline; no CSS modules.
- Components live under `src/components/<feature>/` (e.g. `auth/`, `expense/`).
- Types per resource under `src/types/`.
- Errors come from the backend as `{ errors: ["..."] }` — surface `err.response.data.errors[0]` (see ExpenseCreate's catch).

## Known cleanup opportunities (don't fix unless asked)

- [src/app/layout.tsx](src/app/layout.tsx) imports `AuthProvider` and `QueryClient`/`QueryClientProvider` but never uses them — `<Providers>` already wires both. The imports and the unused `queryClient` are dead code.
- The hand-rolled fetching hooks (above) duplicate what TanStack Query already does in this app.
- No route protection — `/expenses` etc. render for logged-out users until the API call 401s.
