import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchAdminPlayers, fetchAdminStats } from "@/lib/api";

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: fetchAdminStats,
    retry: false,
    staleTime: 15_000,
  });
}

export function useAdminPlayers(page: number, q: string) {
  return useQuery({
    queryKey: ["admin", "players", page, q],
    queryFn: () => fetchAdminPlayers(page, q),
    placeholderData: keepPreviousData,
    retry: false,
    staleTime: 15_000,
  });
}
