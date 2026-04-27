"use client";

import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/api/axiosInstance";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Optional: call backend logout endpoint
      await axiosInstance.delete("/api/v1/logout");
    } catch (err) {
      // Even if API fails, still log out locally
      console.error("Logout error:", err);
    } finally {
      // Remove token from localStorage
      localStorage.removeItem("token");

      // Redirect to login page
      router.push("/login");
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
