import { useQuery } from "@tanstack/react-query";
import customAPI from "@/src/config/api";

export const usePost = (id?: string) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: () => customAPI.get(`/feed/${id}`).then((res) => res.data.data),
    enabled: !!id,
  });
};
