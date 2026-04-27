import axiosInstance from "./axiosInstance";
import { AuthResponse, LoginPayload, SignupPayload } from "@/types/auth";

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    "/api/v1/login",
    { user: payload }
  );

  const token = response.headers["authorization"]?.split(" ")[1];
  if (token) localStorage.setItem("token", token);

  return response.data;
};

export const signupUser = async (payload: SignupPayload): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    "/api/v1/signup",
    { user: payload }
  );

  const token = response.headers["authorization"]?.split(" ")[1];
  if (token) localStorage.setItem("token", token);

  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await axiosInstance.delete("/api/v1/logout");
  localStorage.removeItem("token");
};
