import type { ReactNode } from "react"

type Props = {
  title: string
  subtitle?: string
  children: ReactNode
}

export const AuthCard = ({ title, subtitle, children }: Props) => {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5">
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {children}
      </div>
    </main>
  )
}
