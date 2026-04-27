type Props = {
  label?: string
}

export const Spinner = ({ label = "Loading…" }: Props) => {
  return (
    <div className="flex items-center justify-center gap-2 p-6 text-sm text-gray-500">
      {/* why a span + animate-spin: avoids pulling in an icon library for one
          glyph. Tailwind's `animate-spin` is enough. */}
      <span
        aria-hidden="true"
        className="inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"
      />
      <span>{label}</span>
    </div>
  )
}
