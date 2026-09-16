import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/stores/auth";

export default function ForbiddenPage() {
  const logout = useAuth((s) => s.logout);

  async function handleLogout() {
    await logout();
    window.location.href = "/login";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="text-xl">403 — Không có quyền</CardTitle>
          <CardDescription>Tài khoản này không có quyền quản trị, hoặc đã bị khóa.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button asChild variant="outline">
            <Link to="/login">Về trang đăng nhập</Link>
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
