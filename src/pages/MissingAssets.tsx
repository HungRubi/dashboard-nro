import { useEffect, useMemo, useState } from "react";
import { IconRefresh, IconSearch } from "@tabler/icons-react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { fetchMissingGameAssets, getApiErrorMessage, type MissingAssetCategory, type MissingAssetReference, type MissingGameAssetsResponse } from "@/lib/api";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const categories: { id: MissingAssetCategory; label: string }[] = [
  { id: "items", label: "Vật phẩm" },
  { id: "npcs", label: "NPC" },
  { id: "maps", label: "Map" },
];
const empty: MissingGameAssetsResponse = {
  scannedAt: "", atlasImageCount: 0, items: [],
  summary: { items: { resources: 0, references: 0, entities: 0 }, npcs: { resources: 0, references: 0, entities: 0 }, maps: { resources: 0, references: 0, entities: 0 } },
};

export default function MissingAssetsPage() {
  const [data, setData] = useState(empty);
  const [category, setCategory] = useState<MissingAssetCategory>("items");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const refresh = async () => {
    setLoading(true); setError("");
    try { setData(await fetchMissingGameAssets()); }
    catch (err) { setError(getApiErrorMessage(err)); }
    finally { setLoading(false); }
  };
  useEffect(() => { void refresh(); }, []);
  const rows = useMemo(() => data.items.filter((item) => item.category === category &&
    `${item.entityName} ${item.entityId} ${item.resourceId} ${item.role} ${item.expectedPath}`.toLowerCase().includes(query.toLowerCase())), [data.items, category, query]);
  const summary = data.summary[category];

  return <SidebarProvider style={{ "--sidebar-width": "calc(var(--spacing) * 72)", "--header-height": "calc(var(--spacing) * 12)" } as React.CSSProperties}>
    <AppSidebar variant="inset" />
    <SidebarInset>
      <SiteHeader title="Ảnh lỗi" />
      <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><h1 className="text-xl font-semibold">Tài nguyên thiếu hình ảnh</h1><p className="mt-1 text-sm text-muted-foreground">Quét dữ liệu game và đối chiếu ảnh/icon đang có trên máy chủ.</p></div>
          <button onClick={() => void refresh()} disabled={loading} className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm hover:bg-muted disabled:opacity-50"><IconRefresh size={16} /> Quét lại</button>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {categories.map((item) => <button key={item.id} onClick={() => setCategory(item.id)} className={`rounded-xl border p-4 text-left transition-colors ${category === item.id ? "border-primary bg-primary/5" : "hover:bg-muted/60"}`}>
            <div className="text-sm text-muted-foreground">{item.label}</div><div className="mt-1 text-2xl font-semibold">{data.summary[item.id].resources}</div><div className="text-xs text-muted-foreground">tài nguyên · {data.summary[item.id].entities} đối tượng</div>
          </button>)}
        </div>
        <section className="overflow-hidden rounded-xl border">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b p-3">
            <div><div className="font-medium">{categories.find((item) => item.id === category)?.label} thiếu ảnh</div><div className="text-xs text-muted-foreground">{summary.references} lượt tham chiếu · {summary.resources} tài nguyên riêng</div></div>
            <label className="flex h-9 w-full max-w-sm items-center gap-2 rounded-md border px-3"><IconSearch size={16} className="text-muted-foreground"/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên, ID hoặc đường dẫn..." className="min-w-0 flex-1 bg-transparent text-sm outline-none" /></label>
          </div>
          {error ? <div className="p-8 text-center text-sm text-destructive">{error}</div> : loading ? <div className="p-8 text-center text-sm text-muted-foreground">Đang quét dữ liệu...</div> : rows.length === 0 ? <div className="p-8 text-center text-sm text-muted-foreground">Không tìm thấy ảnh thiếu trong nhóm này.</div> :
            <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-muted/50 text-xs text-muted-foreground"><tr><th className="px-4 py-3">Đối tượng</th><th className="px-4 py-3">ID ảnh / dữ liệu</th><th className="px-4 py-3">Vai trò</th><th className="px-4 py-3">Đường dẫn dự kiến</th></tr></thead><tbody className="divide-y">{rows.map((row: MissingAssetReference, index) => <tr key={`${row.category}-${row.entityId}-${row.resourceId}-${row.role}-${index}`} className="hover:bg-muted/30"><td className="px-4 py-3"><div className="font-medium">{row.entityName}</div><div className="text-xs text-muted-foreground">ID {row.entityId}</div></td><td className="px-4 py-3 font-mono text-xs">{row.resourceId}</td><td className="px-4 py-3">{row.role}</td><td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.expectedPath}</td></tr>)}</tbody></table></div>}
        </section>
        <p className="text-xs text-muted-foreground">Lần quét: {data.scannedAt ? new Date(data.scannedAt).toLocaleString("vi-VN") : "chưa có"} · Atlas: {data.atlasImageCount} ảnh</p>
      </main>
    </SidebarInset>
  </SidebarProvider>;
}
