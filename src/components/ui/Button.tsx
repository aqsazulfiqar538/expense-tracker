// why interface here: Button extends a built-in DOM type. `interface extends`
// is the idiomatic way to do that; `type & ...` works but reads worse for
// component prop types. See ARCHITECTURE.md §1 for the wider rule.
import type { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost"
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 disabled:bg-gray-50",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
}

export const Button = ({ variant = "primary", className = "", ...rest }: ButtonProps) => {
  return (
    <button
      {...rest}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
    />
  )
}
