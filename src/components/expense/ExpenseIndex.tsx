// app/expenses/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useExpenses } from "@/hooks/useExpenses";
import ExpenseCard from "@/components/expense/ExpenseCard";

const ExpensesPage = () => {
  const router = useRouter();
  const { expenses, isLoading, error } = useExpenses();

  if (isLoading) return <p className="p-4 text-gray-500">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Expenses</h1>
        <button
          onClick={() => router.push("/expenses/new")}
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Expense
        </button>
      </div>

      {expenses.length === 0 ? (
        <p className="text-gray-400 text-sm">No expenses yet.</p>
      ) : (
        expenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            onClick={() => router.push(`/expenses/${expense.id}`)}
          />
        ))
      )}
    </div>
  );
};

export default ExpensesPage;
