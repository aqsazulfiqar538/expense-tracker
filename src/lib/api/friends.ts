import axiosInstance from "./axiosInstance";
import { Friend } from "@/types/friend";

export const getFriends = async (): Promise<Friend[]> => {
  const res = await axiosInstance.get("/api/v1/friendships");
  return res.data.data;
};
