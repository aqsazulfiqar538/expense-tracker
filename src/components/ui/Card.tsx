import type { HTMLAttributes } from "react"

// Plain wrapper for the boxed-section look used across the app. Lives as a
// component instead of a CSS class because the same div tends to gain extra
// behavior (header, action button) over time, and a component is the right
// place to grow into.
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  action?: React.ReactNode
}

export const Card = ({ title, action, className = "", children, ...rest }: CardProps) => {
  return (
    <div {...rest} className={`bg-white border border-gray-200 rounded-xl p-5 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-lg font-semibold text-gray-800">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
