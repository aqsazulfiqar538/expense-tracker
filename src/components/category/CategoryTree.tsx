import { EmptyState } from "@/components/ui/EmptyState"
import type { Category } from "@/types/category"

type Props = {
  categories: Category[]
}

export const CategoryTree = ({ categories }: Props) => {
  if (categories.length === 0) {
    return <EmptyState title="No categories yet" description="Create your first category to get started." />
  }

  return (
    <ul className="divide-y divide-gray-100">
      {categories.map((parent) => (
        <li key={parent.id} className="py-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">{parent.name}</span>
            <CustomTag custom={parent.custom} />
          </div>
          {parent.subcategories.length > 0 && (
            <ul className="mt-1 ml-4 border-l border-gray-100 pl-3 space-y-1">
              {parent.subcategories.map((sub) => (
                <li key={sub.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{sub.name}</span>
                  <CustomTag custom={sub.custom} />
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}

const CustomTag = ({ custom }: { custom: boolean }) => (
  <span className={`text-xs px-2 py-0.5 rounded-full ${
    custom ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-600"
  }`}>
    {custom ? "Custom" : "System"}
  </span>
)
