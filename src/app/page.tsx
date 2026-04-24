"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/lib/api/home";
import type { DashboardResponse } from "@/types/dashboard";
import LogoutButton from "@/components/auth/LogoutButton";

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  if (isLoading) return <p className="p-6 text-gray-500">Loading dashboard...</p>;
  if (error) return <p className="p-6 text-red-500">Failed to load dashboard</p>;
  if (!data) return <p className="p-6 text-gray-500">No dashboard data</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8 ">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Expenses</p>
          <h2 className="text-2xl font-bold text-green-600">
            {data?.total_expenses}
          </h2>
        </div>

        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">This Month</p>
          <h2 className="text-2xl font-bold text-blue-600">
            {data?.current_month_total}
          </h2>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Category Breakdown
        </h2>

        <ul className="space-y-2">
          {data &&
            Object.entries(data.category_totals).map(([key, value]) => (
              <li
                key={key}
                className="flex justify-between items-center px-3 py-2 rounded-lg bg-gray-50 border"
              >
                <span className="text-gray-700 font-medium">{key}</span>
                <span className="font-semibold text-gray-900">
                  {value}
                </span>
              </li>
            ))}
        </ul>
      </div>

      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Expenses
        </h2>

        <ul className="space-y-3">
          {data?.recent_expenses?.data?.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-gray-50"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {item.attributes.amount}
                </p>
                <p className="text-sm text-gray-500">
                  {item.attributes.category?.name || "Uncategorized"}
                </p>
                
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}