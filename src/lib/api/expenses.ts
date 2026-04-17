import axiosInstance from "./axiosInstance";
import { Expense } from "@/types/expense";

export const getExpenses = async (): Promise<Expense[]> => {
  const res = await axiosInstance.get("/api/v1/expenses");
  return res.data.data;
};

export const getExpense = async (id: string): Promise<Expense> => {
  const response = await axiosInstance.get(`/api/v1/expenses/${id}`);
  return response.data.data;
};
