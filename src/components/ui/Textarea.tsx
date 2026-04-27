import type { TextareaHTMLAttributes } from "react"

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = ({ label, error, className = "", id, ...rest }: TextareaProps) => {
  const textareaId = id ?? rest.name

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        {...rest}
        className={`w-full border ${error ? "border-red-400" : "border-gray-300"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${className}`}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
