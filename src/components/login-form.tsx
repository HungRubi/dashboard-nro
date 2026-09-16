import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { cn } from "@/lib/utils";

import { api, getApiErrorMessage } from "@/lib/api";
import { NOT_ADMIN, useAuth } from "@/stores/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  username: z.string().trim().min(1, "Nhập tên tài khoản"),
  password: z.string().min(1, "Nhập mật khẩu"),
});

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuth((s) => s.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ username, password });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ");
      return;
    }
    setPending(true);
    setFormError(null);
    try {
      await login(parsed.data.username, parsed.data.password);
      const from = (location.state as { from?: string } | null)?.from ?? "/";
      navigate(from, { replace: true });
    } catch (err) {
      if (err instanceof Error && (err.message === NOT_ADMIN || err.name === NOT_ADMIN)) {
        try {
          await api.post("/auth/logout");
        } catch {
          /* ignore */
        }
        setFormError("Tài khoản không có quyền quản trị");
      } else {
        setFormError(getApiErrorMessage(err));
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Chào mừng trở lại</CardTitle>
          <CardDescription>Đăng nhập trang quản trị Ngọc Rồng</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Tên tài khoản</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nhập tên tài khoản quản trị"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>
              {formError && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {formError}
                </p>
              )}
              <Field>
                <Button type="submit" disabled={pending}>
                  {pending ? "Đang đăng nhập…" : "Đăng nhập"}
                </Button>
                <FieldDescription className="text-center">
                  Chỉ tài khoản quản trị mới đăng nhập được.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
