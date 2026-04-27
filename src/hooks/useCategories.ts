import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api/categories";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getCategories();
      setCategories(res.data ?? []);
    };

    fetchCategories();
  }, []);

  return { categories };
};
