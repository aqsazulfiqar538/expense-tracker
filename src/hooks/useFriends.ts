import { useState, useEffect } from "react";
import { getFriends } from "@/lib/api/friends";
import { Friend } from "@/types/friend";

export const useFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFriends()
      .then(setFriends)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return { friends, isLoading };
};
