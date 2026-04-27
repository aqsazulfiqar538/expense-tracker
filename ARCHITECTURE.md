# Architecture & Conventions

This document explains the *why* behind the code style in this repo. Read it
once. After that, every file should make sense at a glance.

The `CLAUDE.md` next to it covers stack and commands. This file is about how we
write code.

---

## 1. `type` vs `interface`

**Rule:** default to `type`. Use `interface` only when you need to extend or
declaration-merge.

```ts
// Good: a flat object describing data
type User = { id: string; firstName: string; lastName: string }

// Good: a union — `interface` can't do this
type Status = "pending" | "accepted" | "rejected"

// Use interface only for this kind of thing:
interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost"
}
```

**Why:** `type` is a superset of what `interface` can express. Picking one rule
prevents the codebase from drifting into a mix of both for no reason. Two
features `interface` has that `type` doesn't — declaration merging and a
slightly nicer extension syntax — are rarely needed in app code. When you do
need them, switching is one-word.

---

## 2. Named exports vs `export default`

**Rule:** named exports everywhere. The only exception is page/layout files
under `src/app/` — Next.js's App Router *requires* a default export there.

```ts
// Good (anywhere except app/)
export const LoginForm = () => { ... }

// Required by Next (only in app/<route>/page.tsx, layout.tsx, etc.)
export default function LoginPage() { ... }
```

**Why named exports:**
- Renames are safe — your IDE updates every import. With default exports each
  import file is free to pick its own name, so a rename has to be done by hand
  in every consumer.
- Grep is reliable. `grep "export const LoginForm"` finds the definition
  exactly once.
- No "what should I name this default" guessing — the export name is the truth.

**What if you used only `export` (no `default`) on a Next page?**
Next throws at build time: "the default export is not a React Component in
page". Pages are the one place the framework dictates the shape.

---

## 3. Arrow functions vs `function` declarations

**Rule:** components and most helpers are arrow consts. Use `function` only for
recursive top-level helpers.

```ts
// Good
export const ExpenseCard = ({ expense }: Props) => { ... }

// Fine for a recursive tree walker
function flattenTree(node: CategoryNode): Category[] { ... }
```

**Why:**
- Arrow functions inherit `this` — there's no `this`-rebinding footgun, which
  matters in event handlers.
- Const-binding makes the value stable; you can't accidentally reassign
  `LoginForm` later in the file.
- Stays consistent with named exports (`export const X = ...`).
- `function` is fine when you genuinely need hoisting (a function calling
  itself before its own line in the file).

---

## 4. `async`/`await` vs `.then`

**Rule:** `async`/`await` for any code with branching, multiple awaits, or
error handling. `.then(setX)` only when the entire body is "fetch and store
this once" — and even then, treat it as a small code smell, not a recommended
pattern.

```ts
// Good — linear, real try/catch
const handleSubmit = async () => {
  try {
    const user = await loginUser({ email, password })
    setUser(user)
  } catch (err) {
    setError(toMessages(err))
  }
}

// Avoid — error path is invisible, can't await follow-up work
useEffect(() => {
  getExpenses().then(setExpenses)
}, [])
```

**Why:**
- `async`/`await` reads top-to-bottom. `.then(...).then(...)` chains turn into
  parens-soup as soon as you need a second await.
- `try`/`catch` works exactly like in synchronous code. The `.catch` callback
  on a chain is a different beast — if you forget it, errors are swallowed
  silently.
- The exception (one-shot fetch in a `useEffect`) is short enough that a
  reader doesn't have to context-switch.

---

## 5. When to extract a component vs a hook

**Component extraction triggers:**
- The same JSX appears in two places.
- A piece of UI has its own state and the parent is over ~40 lines.
- A region is large enough that its name would help a reader (`<NavBar />`
  beats reading 30 lines of `<header>`).

**Hook extraction triggers:**
- The same `useState` + `useEffect` pattern appears in two components.
- Two unrelated components need to share state — pull the state into a hook
  that uses context, instead of lifting state up through a tree.

**Don't pre-extract.** Three near-duplicates is when you abstract. Two is
borderline; one is just code. Premature abstraction is harder to undo than
copy-paste.

```ts
// Worth extracting: same shape used 3+ times
const useDebounced = <T,>(value: T, delay: number): T => { ... }

// Not worth extracting: a 4-line useEffect used once
useEffect(() => { document.title = title }, [title])
```

---

## 6. Why axios stays, why TanStack Query goes

**Axios stays.** It gives one place — request/response interceptors — to attach
the JWT and normalize the Rails error envelope (`{errors: [...]}` /
`{error: "..."}`) into a single shape. Replacing it with `fetch` would mean
re-implementing those interceptors in user-land, which is busywork.

**TanStack Query went.** Its big features are caching, dedupe, and
invalidation. None of that pays off in this app: every page already refetches
on mount, mutations are infrequent, and the UI is small enough that a stale
cache is more confusing than helpful. We replaced ~40KB of dependency with two
generic hooks (`useApi`, `useMutation`) totalling ~65 lines you can read.

If we ever need to share a cache *across* pages that don't refetch on mount,
the right move is to revisit this — not to bring back Query as cargo-cult.

---

## 7. Why localStorage for the JWT

The token is stored in `localStorage` and attached to every request via the
axios interceptor. **This is XSS-vulnerable** — any script that runs in the
page can read it. The trade-off is deliberate:

- The backend issues 90-day JWTs and has no refresh-token flow.
- For a learning project with no third-party scripts, the practical risk is
  low.
- Switching to httpOnly cookies later means changing two files: `lib/storage.ts`
  (drop it) and `lib/apiClient.ts` (set `withCredentials: true`). The rest of
  the app doesn't notice.

`lib/storage.ts` guards every call with `typeof window !== "undefined"` so the
code doesn't crash during SSR.

---

## 8. JSON:API unwrapping policy

The backend uses `jsonapi-serializer`, which returns shapes like:

```json
{ "data": { "id": "1", "type": "expense", "attributes": { "title": "...", "amount": "30.00" } } }
```

**Rule:** every function in `lib/api/*.ts` calls `unwrap()` /  `unwrapList()`
from `lib/jsonapi.ts` and returns a flat object. Components see
`expense.title`, never `expense.attributes.title`.

**Why:** the JSON:API shape is a backend serialization detail. Coupling
component code to it would make a backend serializer change ripple into every
component. With the unwrap layer, swapping serializers means updating one
file.

The dashboard endpoint is the one exception in the backend — it returns a flat
object directly. Its API function unwraps nothing.

---

## 9. Error contract

`lib/apiClient.ts` has a response interceptor that normalizes any backend
error response into a single `ApiError`:

```ts
type ApiError = { messages: string[]; status: number }
```

Rails returns errors in two shapes (`{ errors: [...] }` and `{ error: "..." }`)
and Devise sometimes returns plain strings. The interceptor handles all three
so callers never have to.

In components:

```tsx
{error && <ErrorBanner messages={error.messages} />}
```

That's the entire error UI contract.

---

## 10. Folder discipline

`src/app/` is for routing only. A page file looks like this — no exceptions:

```tsx
export default function ExpensesPage() {
  const { data, isLoading, error } = useApi(getExpenses, [])
  return (
    <RequireAuth>
      <AppShell>
        {isLoading ? <Spinner /> :
         error ? <ErrorBanner messages={error.messages} /> :
         data && <ExpenseList expenses={data} />}
      </AppShell>
    </RequireAuth>
  )
}
```

All real logic — state, forms, mutations, business rules — lives under
`components/<feature>/`. API calls live under `lib/api/`. Types live under
`types/`. A reader who wants to find "where does the friend-request UI live?"
can answer it from the folder names alone.

---

## 11. File-size budget

- **Pages** (`src/app/**/page.tsx`): under 30 lines. If a page grows past
  that, the logic belongs in a component.
- **Components**: aim for under 80 lines. Cross 80, extract a child
  component.
- **Hooks / lib helpers**: usually under 50 lines. The two generic hooks are
  the longest at ~35 lines each.

These are budgets, not laws. A form with 12 fields will be longer; that's
fine. The rule exists so we *notice* when a file is getting long, not so we
fight to keep every file under 80 lines.

---

## 12. Conventions cheat-sheet

| Where             | Pattern                                                |
| ----------------- | ------------------------------------------------------ |
| Pages             | `export default function`, thin shell, <30 lines       |
| Components        | `export const Foo = () => { ... }`                     |
| Types             | `type Foo = { ... }`                                   |
| API functions     | `export const getX = async (): Promise<X> => { ... }`  |
| Imports from src  | `@/lib/...`, `@/components/...`, `@/types/...`         |
| Styling           | Tailwind utilities only; no CSS modules, no styled-components |
| Errors in UI      | `<ErrorBanner messages={error.messages} />`            |
| Loading in UI     | `<Spinner />`                                          |
| Empty in UI       | `<EmptyState ... />`                                   |
