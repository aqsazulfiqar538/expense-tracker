type Props = {
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState = ({ title, description, action }: Props) => {
  return (
    <div className="text-center py-10 px-4 space-y-2">
      <p className="text-sm font-medium text-gray-700">{title}</p>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      {action && <div className="pt-2">{action}</div>}
    </div>
  )
}
