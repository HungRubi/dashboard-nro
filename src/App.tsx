import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAdmin } from "@/components/RequireAdmin";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ForbiddenPage from "@/pages/Forbidden";
import LoginPage from "@/pages/Login";
import DashboardPage from "@/pages/Dashboard";
import PlayersPage from "@/pages/Players";

export default function App() {
  return (
    <TooltipProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/403" element={<ForbiddenPage />} />
        <Route
          path="/"
          element={
            <RequireAdmin>
              <DashboardPage />
            </RequireAdmin>
          }
        />
        <Route
          path="/nhan-vat"
          element={
            <RequireAdmin>
              <PlayersPage />
            </RequireAdmin>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </TooltipProvider>
  );
}
