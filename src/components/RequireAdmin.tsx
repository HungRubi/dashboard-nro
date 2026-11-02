import { useQuery } from "@tanstack/react-query";
import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { isFullAdmin, useAuth } from "@/stores/auth";
import { Skeleton } from "@/components/ui/skeleton";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const token = useAuth((s) => s.token);
  const location = useLocation();

  const {
    data: me,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dash-me"],
    queryFn: () => useAuth.getState().fetchMe(),
    enabled: token !== null,
    retry: false,
    staleTime: 30_000,
  });

  if (token === null || isError) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (isLoading || !me) {
    return (
      <div className="flex min-h-screen flex-col gap-3 p-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }
  if (!isFullAdmin(me)) {
    return <Navigate to="/403" replace />;
  }
  return <>{children}</>;
}
