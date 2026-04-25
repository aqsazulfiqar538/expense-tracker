import type { InputHTMLAttributes } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = ({ label, error, className = "", id, ...rest }: InputProps) => {
  // why we derive the id from `name` if not given:
  //   <label htmlFor> is required for screen readers. Manually passing
  //   matching ids everywhere is friction; this gives a sensible default.
  const inputId = id ?? rest.name

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...rest}
        className={`w-full border ${error ? "border-red-400" : "border-gray-300"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
