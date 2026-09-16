import { useState, type FormEvent } from "react";
import { useAdminPlayers } from "@/hooks/use-admin";
import { getApiErrorMessage, type AdminPlayer } from "@/lib/api";
import { clanName, formatDateTime, formatNumber, genderName } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PlayersTable({ onSelect }: { onSelect: (p: AdminPlayer) => void }) {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [q, setQ] = useState("");
  const { data, isLoading, isError, error, isFetching } = useAdminPlayers(page, q);

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 20;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPage(1);
    setQ(keyword.trim());
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách nhân vật</CardTitle>
        <form onSubmit={onSubmit} className="flex gap-2">
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo tên nhân vật hoặc tài khoản…"
            aria-label="Tìm kiếm nhân vật"
          />
          <Button type="submit" disabled={isFetching}>
            {isFetching ? "Đang tìm…" : "Tìm kiếm"}
          </Button>
        </form>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
            {getApiErrorMessage(error)}
          </p>
        ) : items.length === 0 ? (
          <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Không có kết quả nào.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tên nhân vật</TableHead>
                  <TableHead>Tài khoản</TableHead>
                  <TableHead>Phái</TableHead>
                  <TableHead>Bang hội</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Điểm PvP</TableHead>
                  <TableHead>Tàu vũ trụ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((p) => (
                  <TableRow key={p.id} className="cursor-pointer" onClick={() => onSelect(p)}>
                    <TableCell className="font-medium">{p.id}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.username ?? `#${p.account_id ?? "—"}`}</TableCell>
                    <TableCell>{genderName(p.gender)}</TableCell>
                    <TableCell>{clanName(p.clan_id_sv1, p.clan_id_sv2)}</TableCell>
                    <TableCell>{formatDateTime(p.create_time)}</TableCell>
                    <TableCell className="text-right">{formatNumber(p.pointPvp)}</TableCell>
                    <TableCell>
                      <Badge variant={p.have_tennis_space_ship === 1 ? "default" : "secondary"}>
                        {p.have_tennis_space_ship === 1 ? "Đã có" : "Chưa có"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Trang {page} / {totalPages} · Tổng {formatNumber(total)} nhân vật
          </p>
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage(1)}
              aria-label="Về trang đầu"
            >
              Về đầu
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((v) => v - 1)}
              aria-label="Trang trước"
            >
              Trang trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((v) => v + 1)}
              aria-label="Trang tiếp"
            >
              Trang tiếp
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage(totalPages)}
              aria-label="Về trang cuối"
            >
              Về cuối
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
