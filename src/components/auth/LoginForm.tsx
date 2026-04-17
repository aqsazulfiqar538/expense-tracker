"use client";

import { useState } from "react";
import { loginUser } from "@/lib/api/auth";
import type { LoginPayload } from "@/types/auth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [form, setForm] = useState<LoginPayload>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await loginUser(form);
      router.push("/dashboard");
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.errors?.join(", ") ||
        "Login failed. Please try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Login</h2>

      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
