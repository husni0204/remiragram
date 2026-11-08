import { useQuery } from "@tanstack/react-query";
import customAPI from "@/src/config/api";

export const useUser = (username?: string) => {
  return useQuery({
    queryKey: ["user", username],
    queryFn: () => customAPI.get(`/user/${username}`).then((res) => res.data.data),
    enabled: !!username,
  });
};
