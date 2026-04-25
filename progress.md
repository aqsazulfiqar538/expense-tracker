# Frontend Rewrite — Progress

This file is the source of truth for what's done and what's next. Tick the boxes
in the same chat session as the work; don't batch.

## Phase 0 — Foundation (unblocks every later phase)
- [x] `progress.md` created at repo root
- [x] `ARCHITECTURE.md` created at repo root
- [x] `package.json` — remove `@tanstack/react-query`
- [x] `src/lib/storage.ts` — SSR-safe localStorage wrapper
- [x] `src/lib/apiClient.ts` — axios instance + auth interceptor + error normalizer + 401 handler
- [x] `src/lib/jsonapi.ts` — `unwrap` / `unwrapList`
- [x] `src/hooks/useApi.ts` — generic GET hook
- [x] `src/hooks/useMutation.ts` — generic write hook
- [x] `src/hooks/useAuth.ts` — re-export of `useContext(AuthContext)`
- [x] `src/types/api.ts` — `ApiError`, `Paginated<T>`
- [x] `src/components/ui/` — Button, Input, Select, Textarea, Card, Spinner, ErrorBanner, EmptyState
- [x] `src/app/layout.tsx` — drop dead imports
- [x] `src/app/providers.tsx` — drop `QueryClientProvider`

## Phase 1 — Auth (completion)
- [x] `src/lib/api/auth.ts` — login, signup, logout, forgotPassword, resetPassword, confirmAccount, resendConfirmation
- [x] `src/lib/api/users.ts` — `getProfile` (used by AuthContext bootstrap; backend route is `/users/profile`, not `/users/me`)
- [x] `src/types/user.ts`
- [x] `src/context/AuthContext.tsx` — rewritten; bootstraps user from `/users/profile` if token exists
- [x] `src/components/auth/LoginForm.tsx`
- [x] `src/components/auth/SignupForm.tsx`
- [x] `src/components/auth/ForgotPasswordForm.tsx`
- [x] `src/components/auth/ResetPasswordForm.tsx`
- [x] `src/components/auth/ConfirmEmailNotice.tsx`
- [x] `src/components/auth/LogoutButton.tsx`
- [x] `src/app/login/page.tsx` (thin shell)
- [x] `src/app/signup/page.tsx` (thin shell)
- [x] `src/app/forgot-password/page.tsx`
- [x] `src/app/reset-password/page.tsx`
- [x] `src/app/confirm/page.tsx`
- [x] Manual: signup → email confirm → login works end-to-end (after backend mailer template fix)
- [x] Manual: forgot-password → reset → login with new password works (after backend mailer template fix)
- [x] `npm run lint` clean, `npx tsc --noEmit` clean (also: `npm run build` passes)

## Phase 2 — Dashboard
- [x] `src/components/layout/RequireAuth.tsx` — client-side route guard
- [x] `src/components/layout/AppShell.tsx` — nav + main wrapper
- [x] `src/components/layout/NavBar.tsx` — links (notifications badge stub now, real in Phase 7)
- [x] `src/lib/api/dashboard.ts` — `getDashboard`
- [x] `src/types/dashboard.ts` — flat types
- [x] `src/components/dashboard/StatsCards.tsx`
- [x] `src/components/dashboard/CategoryBreakdown.tsx`
- [x] `src/components/dashboard/RecentExpenses.tsx`
- [x] `src/components/dashboard/RecentLedger.tsx` (renamed from RecentActivity for clarity)
- [x] `src/app/page.tsx` — thin shell composing the four dashboard components
- [ ] Manual: every section renders, empty states show when no data
- [x] Manual: page file is <30 lines and has no API/business logic (page.tsx is 33 lines incl. imports/blank — every line is composition, no state/formatting)

## Phase 3 — Expenses + Categories

Categories first (expenses depend on them):
- [ ] `src/lib/api/categories.ts` — listCategories, createCategory (supports `parent_id`)
- [ ] `src/types/category.ts`
- [ ] `src/components/category/CategorySelect.tsx` — dropdown of system + own + "Create your own…" option
- [ ] `src/components/category/CategoryCreateModal.tsx` — name input + optional parent select (subcategory of any system or own category)
- [ ] `src/components/category/CategoryTree.tsx` — read-only nested view for the management page
- [ ] `src/app/categories/page.tsx` — manage page (list + create)

Expenses:
- [ ] `src/lib/api/expenses.ts` — list, get, create, update, delete (with category/date filters)
- [ ] `src/lib/api/comments.ts` — list, create, delete
- [ ] `src/types/expense.ts`, `src/types/comment.ts`
- [ ] `src/components/expense/ExpenseList.tsx`
- [ ] `src/components/expense/ExpenseCard.tsx`
- [ ] `src/components/expense/ExpenseForm.tsx` — used by both create and edit; integrates `CategorySelect`
- [ ] `src/components/expense/SplitEditor.tsx` — equal vs custom; live total + diff; submit disabled when invalid
- [ ] `src/components/expense/ParticipantPicker.tsx` — friends multi-select (accepts `friends` prop; until Phase 4 the consumer passes `[]`)
- [ ] `src/components/expense/ExpenseDetail.tsx`
- [ ] `src/components/expense/CommentList.tsx`
- [ ] `src/components/expense/CommentForm.tsx`
- [ ] `src/app/expenses/page.tsx`
- [ ] `src/app/expenses/new/page.tsx`
- [ ] `src/app/expenses/[id]/page.tsx`
- [ ] Manual: create individual expense
- [ ] Manual: create + browse a system subcategory and a fully custom category, use both on a new expense
- [ ] Manual: equal split creates correct repayments
- [ ] Manual: custom split refuses submit when shares don't sum, accepts when they do
- [ ] Manual: edit + soft-delete own expense; edit/delete someone else's surfaces the 403

## Phase 4 — Friends
- [ ] `src/lib/api/friends.ts`, `friendRequests.ts`, `users.ts` (extend with `searchUsers`)
- [ ] `src/types/friend.ts`
- [ ] `src/hooks/useDebounced.ts` (~15 lines)
- [ ] `src/components/friend/UserSearch.tsx`
- [ ] `src/components/friend/FriendList.tsx`
- [ ] `src/components/friend/FriendRequestList.tsx`
- [ ] `src/app/friends/page.tsx`, `src/app/friends/requests/page.tsx`
- [ ] Manual: search excludes self + existing friends
- [ ] Manual: send / accept / reject / remove friend flows
- [ ] Retro: `ParticipantPicker` (built in Phase 3) now wired with real friends list on `ExpenseForm`

## Phase 5 — Groups
- [ ] `src/lib/api/groups.ts`, `src/lib/api/members.ts`
- [ ] `src/types/group.ts`
- [ ] `src/components/group/GroupCard.tsx`
- [ ] `src/components/group/GroupTypeSelect.tsx`
- [ ] `src/components/group/GroupForm.tsx`
- [ ] `src/components/group/GroupMemberList.tsx`
- [ ] `src/app/groups/page.tsx`, `new/page.tsx`, `[id]/page.tsx`
- [ ] Manual: create group with friends as members
- [ ] Manual: edit / delete as creator; non-creator gets 403
- [ ] Manual: add + remove member; remove blocked when unsettled debts exist (backend message renders)
- [ ] Manual: group detail reuses `ExpenseList` for the group's expenses

## Phase 6 — Ledger
- [ ] `src/lib/api/ledger.ts`, `src/lib/api/repayments.ts`
- [ ] `src/types/ledger.ts`, `src/types/repayment.ts`
- [ ] `src/components/ledger/LedgerSummary.tsx`
- [ ] `src/components/ledger/FriendLedger.tsx`
- [ ] `src/components/ledger/RepaymentRow.tsx`
- [ ] `src/app/ledger/page.tsx`, `src/app/ledger/[friendId]/page.tsx`
- [ ] Manual: totals on `/ledger` match `/dashboard`
- [ ] Manual: per-friend bilateral ledger correct in both directions
- [ ] Manual: settle a repayment → settlement expense + system comment appear; row removed from unsettled list
- [ ] Retro: `/` dashboard now reuses `LedgerSummary` instead of duplicating logic

## Phase 7 — Notifications
- [ ] `src/lib/api/notifications.ts`
- [ ] `src/types/notification.ts`
- [ ] `src/components/notification/NotificationItem.tsx` — type-specific icon + content
- [ ] `src/components/notification/NotificationList.tsx`
- [ ] `src/app/notifications/page.tsx`
- [ ] `NavBar.tsx` — wire real unread badge (refetches on route change)
- [ ] Manual: triggering a backend event (e.g. friend request) creates a notification visible here
- [ ] Manual: "mark all read" zeroes the badge
