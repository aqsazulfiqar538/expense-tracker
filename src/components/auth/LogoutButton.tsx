"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const LogoutButton = () => {
  const router = useRouter();
  const { logout, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 bg-red-500 text-white rounded"
    >
      {loading ? "Logging out." : "Logout"}
    </button>
  );
};

export default LogoutButton;
