"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getExpense } from "@/lib/api/expenses";

export default function ExpenseShow() {
  const params = useParams();
  const id = params.id as string;

  const { data: expense, isLoading, error } = useQuery({
    queryKey: ["expense", id],
    queryFn: () => getExpense(id),
    enabled: !!id,
  });

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">Failed to load expense</p>;
  if (!expense) return <p className="p-4">No expense found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Expense Details</h1>
      <div className="border p-4 rounded space-y-2">
        <p><strong>Amount:</strong> {expense.attributes.amount}</p>
        <p><strong>Description:</strong> {expense.attributes.title}</p>
        <p><strong>Category:</strong> {expense.relationships.category?.data?.id}</p>
        <p><strong>Date:</strong> {expense.attributes.start_date}</p>
      </div>
    </div>
  );
}
