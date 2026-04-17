"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { SignupPayload } from "@/types/auth";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();
  const { signup, loading, error } = useAuth();

  const [form, setForm] = useState<SignupPayload>({
    email: "",
    password: "",
    password_confirmation: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    date_of_birth: "",
  });

  const handleChange = ( e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signup(form);
      router.push("/");
    } catch {
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Create Account</h2>

      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={form.first_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={form.last_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

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

        <input
          type="password"
          name="password_confirmation"
          placeholder="Password Confirmation"
          value={form.password_confirmation}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={form.phone_number}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="date"
          name="date_of_birth"
          value={form.date_of_birth}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
