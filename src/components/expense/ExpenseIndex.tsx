"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Expense } from "@/types/expense";
import { getExpenses } from "@/lib/api/expenses";

const ExpenseIndex = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getExpenses();
        setExpenses(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Expenses</h2>

      {expenses.map((expense) => (
        <div key={expense.id}>
          <p>{expense.attributes.title}</p>
          <p>{expense.attributes.amount}</p>

          <button onClick={() => router.push(`/expenses/${expense.id}`)}>
            View
          </button>
        </div>
      ))}
    </div>
  );
};

export default ExpenseIndex;
