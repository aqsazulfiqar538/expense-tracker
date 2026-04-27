import { useState, useEffect } from "react";
import { getExpenses } from "@/lib/api/expenses";
import { Expense } from "@/types/expense";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getExpenses()
      .then(setExpenses)
      .catch(() => setError("Failed to fetch expenses"))
      .finally(() => setIsLoading(false));
  }, []);

  return { expenses, isLoading, error };
};
