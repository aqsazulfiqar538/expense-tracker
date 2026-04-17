"use client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getExpenses } from "@/lib/api/expenses";

const ExpenseIndex = () => {
  const router = useRouter();

  const { data: expenses, isLoading, error } = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to fetch</p>;

  return (
    <div>
      <h2>Expenses</h2>
      {expenses?.map((expense) => (
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
