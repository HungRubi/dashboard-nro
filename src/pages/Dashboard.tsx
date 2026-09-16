import type { CSSProperties } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminStats } from "@/hooks/use-admin";
import { getApiErrorMessage } from "@/lib/api";
import { formatNumber } from "@/lib/format";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useAdminStats();

  const cards: Array<[string, string]> = data
    ? [
        ["Tổng tài khoản", formatNumber(data.accounts.total)],
        ["Đang trực tuyến", formatNumber(data.accounts.online)],
        ["Tài khoản bị khóa", formatNumber(data.accounts.banned)],
        ["Tổng nhân vật", formatNumber(data.players.total)],
        ["Tổng bài viết", formatNumber(data.posts.total)],
        ["Lượt nạp thành công", formatNumber(data.topups.total)],
        ["Tổng VND đã nạp", formatNumber(data.topups.vnd)],
      ]
    : [];

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title="Tổng quan" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:px-6 xl:grid-cols-4">
                {isLoading ? (
                  [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28 w-full" />)
                ) : isError ? (
                  <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600 sm:col-span-2 xl:col-span-4">
                    {getApiErrorMessage(error)}
                  </p>
                ) : (
                  cards.map(([label, value]) => (
                    <Card key={label}>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium text-slate-500">
                          {label}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold text-slate-900">{value}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
