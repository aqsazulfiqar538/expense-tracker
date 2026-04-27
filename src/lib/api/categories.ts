import axiosInstance from "./axiosInstance";

export const getCategories = async () => {
  const res = await axiosInstance.get("/api/v1/categories");

  console.log("category resposne:", res.data);

  return res.data.data;
};
