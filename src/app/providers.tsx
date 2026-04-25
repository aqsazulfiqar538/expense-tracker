"use client"

// why this file exists at all:
// `AuthProvider` calls hooks (useState, useEffect) so it must run on the
// client. `app/layout.tsx` is a Server Component by default, and Server
// Components can't render Client Components that use hooks at the top level
// without a "use client" boundary. Putting the providers in their own
// "use client" file keeps the layout server-rendered while still letting
// auth state be available everywhere.
import { AuthProvider } from "@/context/AuthContext"

type Props = { children: React.ReactNode }

export const Providers = ({ children }: Props) => {
  return <AuthProvider>{children}</AuthProvider>
}
