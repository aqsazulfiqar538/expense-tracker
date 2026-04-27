// components/expenses/ExpenseCard.tsx
import { Expense } from "@/types/expense";

type Props = {
  expense: Expense;
  onClick: () => void;
};

const ExpenseCard = ({ expense, onClick }: Props) => {
  const { title, amount, start_date, category_name, participants } =
    expense.attributes;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer border border-gray-200 rounded-xl p-4 hover:shadow-md transition space-y-2"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-gray-800">{title}</h2>
        <span className="text-sm font-semibold text-blue-600">
          Rs. {amount}
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span>{start_date}</span>
        {category_name && (
          <span className="bg-gray-100 px-2 py-0.5 rounded-full">
            {category_name}
          </span>
        )}
      </div>

      {participants?.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {participants.map((p) => (
            <span
              key={p.id}
              className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full"
            >
              {p.attributes.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseCard;
