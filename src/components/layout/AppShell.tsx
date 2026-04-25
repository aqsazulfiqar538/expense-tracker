import type { ReactNode } from "react"
import { NavBar } from "@/components/layout/NavBar"

type Props = { children: ReactNode }

export const AppShell = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
