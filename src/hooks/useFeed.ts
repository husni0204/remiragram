import { useInfiniteQuery } from "@tanstack/react-query";
import customAPI from "@/src/config/api";

export const useFeed = () => {
  return useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam = 1 }) =>
      customAPI.get(`/feed?page=${pageParam}&limit=2`).then((res) => res.data),
    getNextPageParam: (lastPage) => {
      // Assuming the response includes totalPages and currentPage
      const { page, totalPages } = lastPage;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
