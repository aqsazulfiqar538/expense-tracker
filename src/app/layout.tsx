import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

// why two font instances: Next.js's `next/font` self-hosts the font files at
// build time. Each call returns a CSS variable we expose on <html> so any
// component can reference --font-geist-sans / --font-geist-mono via Tailwind.
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Split expenses, settle debts, stay friends.",
}

// why default export: required by Next.js App Router for route files
// (page.tsx, layout.tsx, etc.). See ARCHITECTURE.md §2.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-gray-50 text-gray-900 flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
