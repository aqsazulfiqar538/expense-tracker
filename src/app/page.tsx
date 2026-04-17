"use client";

import { useEffect, useState } from "react";
import { getDashboard } from "@/lib/api/home";
import type { DashboardResponse } from "@/types/dashboard";
import LogoutButton from "@/components/auth/LogoutButton"; 

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboard();
        setData(res);
      } catch (err) {
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p className="p-4">Loading dashboard...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <LogoutButton />
      
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded">
          <p>Total Expenses</p>
          <h2 className="text-xl font-semibold">
            {data?.total_expenses}
          </h2>
        </div>

        <div className="p-4 border rounded">
          <p>This Month</p>
          <h2 className="text-xl font-semibold">
            {data?.current_month_total}
          </h2>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">
          Category Breakdown
        </h2>

        <ul className="space-y-1">
          {data &&
            Object.entries(data.category_totals).map(([key, value]) => (
              <li key={key} className="flex justify-between border p-2 rounded">
                <span>{key}</span>
                <span>{value}</span>
              </li>
            ))}
        </ul>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">
          Recent Expenses
        </h2>

        <ul className="space-y-2">
          {data?.recent_expenses?.data?.map((item) => (
            <li key={item.id} className="border p-2 rounded">
              <p>Amount: {item.attributes.amount}</p>
              <p>
                Category: {item.attributes.category?.name || "N/A"}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
