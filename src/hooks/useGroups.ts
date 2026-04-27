import { useState, useEffect } from "react";
import { getGroups } from "@/lib/api/groups";
import { Group } from "@/types/group";

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getGroups()
      .then(setGroups)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return { groups, isLoading };
};
    