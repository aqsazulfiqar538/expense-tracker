import axiosInstance from "./axiosInstance";
import { Expense, CreateExpensePayload } from "@/types/expense";

export const getExpenses = async (): Promise<Expense[]> => {
  const res = await axiosInstance.get("/api/v1/expenses");
  return res.data.data;
};

export const getExpense = async (id: string): Promise<Expense> => {
  const res = await axiosInstance.get(`/api/v1/expenses/${id}`);
  return res.data.data;
};

export const createExpense = async (
  payload: CreateExpensePayload
): Promise<Expense> => {
  const res = await axiosInstance.post("/api/v1/expenses", {
    expense: payload,
  });
  return res.data.data;
};
