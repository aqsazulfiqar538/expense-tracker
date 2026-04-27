"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { LogoutButton } from "@/components/auth/LogoutButton"

const navLinks: ReadonlyArray<{ href: string; label: string }> = [
  { href: "/", label: "Dashboard" },
  { href: "/expenses", label: "Expenses" },
  { href: "/friends", label: "Friends" },
  { href: "/groups", label: "Groups" },
  { href: "/ledger", label: "Ledger" },
]

export const NavBar = () => {
  const { user } = useAuth()
  const unreadCount = 0

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-gray-900">Expense Tracker</Link>
          <ul className="hidden md:flex items-center gap-4 text-sm text-gray-600">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-gray-900">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/notifications" className="relative text-sm text-gray-600 hover:text-gray-900">
            Notifications
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-3 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                {unreadCount}
              </span>
            )}
          </Link>
          {user && <span className="text-sm text-gray-700 hidden sm:inline">{user.first_name}</span>}
          <LogoutButton />
        </div>
      </nav>
    </header>
  )
}
