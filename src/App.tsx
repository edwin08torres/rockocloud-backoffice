import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "@/layouts/AdminLayout";
import Catalog from "@/pages/Catalog";
import Clients from "@/pages/Clients";
import Dashboard from "@/pages/Dashboard";
import Devices from "@/pages/Devices";
import Login from "@/pages/Login";
import Settings from "@/pages/Settings";
import { useAuthStore } from "@/stores/useAuthStore";

function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  if (user?.role !== "SuperAdmin") {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1e293b",
            color: "#e2e8f0",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            fontSize: "14px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            maxWidth: "380px",
          },
          success: {
            iconTheme: { primary: "#34d399", secondary: "#0f172a" },
            duration: 4000,
          },
          error: {
            iconTheme: { primary: "#f87171", secondary: "#0f172a" },
            duration: 5000,
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="rockolas" element={<Devices />} />
          <Route path="catalogo" element={<Catalog />} />
          <Route
            path="clientes"
            element={
              <SuperAdminRoute>
                <Clients />
              </SuperAdminRoute>
            }
          />
          <Route path="config" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-slate-100">{title}</h1>
      <div className="bg-slate-900 border border-white/[0.06] rounded-2xl p-6 text-center py-16">
        <p className="text-slate-500 text-sm">Módulo en construcción…</p>
      </div>
    </div>
  );
}
