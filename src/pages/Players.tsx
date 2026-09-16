import type { CSSProperties } from "react";
import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { PlayerDetail } from "@/components/admin/player-detail";
import { PlayersTable } from "@/components/admin/players-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { AdminPlayer } from "@/lib/api";

export default function PlayersPage() {
  const [selected, setSelected] = useState<AdminPlayer | null>(null);
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
        <SiteHeader title="Nhân vật" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <PlayersTable onSelect={setSelected} />
              </div>
              {selected && (
                <div className="px-4 lg:px-6">
                  <PlayerDetail player={selected} onClose={() => setSelected(null)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
