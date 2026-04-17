"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getExpense } from "@/lib/api/expenses";

export default function ExpenseShow() {
  const params = useParams();
  const id = params.id as string;

  const [expense, setExpense] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("expense:", expense)
  }, [expense])

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const data = await getExpense(id);
        setExpense(data);
      } catch (err) {
        setError("Failed to load expense");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchExpense();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

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
