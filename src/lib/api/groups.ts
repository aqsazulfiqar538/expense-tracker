import axiosInstance from "./axiosInstance";
import { Group } from "@/types/group";

export const getGroups = async (): Promise<Group[]> => {
  const res = await axiosInstance.get("/api/v1/groups");
  return res.data.data;
};
