import type { AdminPlayer } from "@/lib/api";
import { clanName, formatDateTime, formatNumber, genderName } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PlayerDetail({
  player,
  onClose,
}: {
  player: AdminPlayer | null;
  onClose: () => void;
}) {
  if (!player) return null;
  const rows: Array<[string, string]> = [
    ["ID nhân vật", String(player.id)],
    ["Tên nhân vật", player.name],
    ["Tài khoản", player.username ?? `#${player.account_id ?? "—"}`],
    ["ID tài khoản", player.account_id === null ? "—" : String(player.account_id)],
    ["Phái", genderName(player.gender)],
    ["Bang hội", clanName(player.clan_id_sv1, player.clan_id_sv2)],
    ["Ngày tạo", formatDateTime(player.create_time)],
    ["Điểm PvP", formatNumber(player.pointPvp)],
    ["VND", formatNumber(player.vnd)],
    ["Vi phạm", formatNumber(player.violate)],
    ["Mã đầu (head)", String(player.head)],
  ];
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Chi tiết nhân vật: {player.name}</CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant={player.have_tennis_space_ship === 1 ? "default" : "secondary"}>
            Tàu vũ trụ: {player.have_tennis_space_ship === 1 ? "Đã có" : "Chưa có"}
          </Badge>
        </div>
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-4 py-2.5 text-sm"
          >
            <span className="text-slate-500">{label}</span>
            <span className="font-medium text-slate-900">{value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
