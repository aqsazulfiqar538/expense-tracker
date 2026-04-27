import Link from "next/link"

// Placeholder until Phase 2 (dashboard). Kept tiny so the "/" route exists.
export default function HomePage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-2xl font-semibold">Expense Tracker</h1>
        <p className="text-sm text-gray-600">
          Dashboard is coming in Phase 2. For now, head to the auth screens.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link className="text-blue-600 hover:underline" href="/login">Log in</Link>
          <span className="text-gray-300">·</span>
          <Link className="text-blue-600 hover:underline" href="/signup">Sign up</Link>
        </div>
      </div>
    </main>
  )
}
