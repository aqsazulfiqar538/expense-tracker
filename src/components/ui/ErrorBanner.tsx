type Props = {
  messages: string[]
}

// Mirrors the error contract from ARCHITECTURE.md §9. Every API error in the
// app is normalized to `string[]`, so this component is the only error UI we
// need to write.
export const ErrorBanner = ({ messages }: Props) => {
  if (messages.length === 0) return null

  return (
    <div className="bg-red-50 border border-red-200 text-red-800 text-sm rounded-lg px-3 py-2">
      {messages.length === 1 ? (
        <p>{messages[0]}</p>
      ) : (
        <ul className="list-disc list-inside space-y-0.5">
          {messages.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      )}
    </div>
  )
}
