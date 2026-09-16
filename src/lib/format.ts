const GENDER_NAMES = ["Trái Đất", "Namek", "Xayda"] as const;

export function formatNumber(v: number | string | null | undefined): string {
  const n = typeof v === "string" ? Number(v) : (v ?? 0);
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("vi-VN");
}

export function formatDateTime(v: string | null | undefined): string {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("vi-VN");
}

export function genderName(g: number | null | undefined): string {
  if (g === null || g === undefined) return "—";
  return GENDER_NAMES[g] ?? `#${g}`;
}

export function clanName(sv1: number | null, sv2: number | null): string {
  const parts: string[] = [];
  if (sv1 !== null && sv1 !== undefined && sv1 !== -1) parts.push(`SV1: #${sv1}`);
  if (sv2 !== null && sv2 !== undefined && sv2 !== -1) parts.push(`SV2: #${sv2}`);
  return parts.length > 0 ? parts.join(" · ") : "Chưa có";
}
