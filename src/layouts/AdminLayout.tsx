import {
  LayoutDashboard,
  Speaker,
  Library,
  Settings,
  LogOut,
  Music2,
  Menu,
  X,
  ChevronRight,
  Building,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Navigate, Outlet, NavLink } from "react-router-dom";

import { useAuthStore } from "../stores/useAuthStore";

const NAV_ITEMS = [
  { to: "/",         label: "Dashboard",     icon: LayoutDashboard, end: true },
  { to: "/rockolas", label: "Mis Rockolas",  icon: Speaker },
  { to: "/catalogo", label: "Catálogo",      icon: Library },
  { to: "/clientes", label: "Clientes",      icon: Building, requireSuperAdmin: true },
  { to: "/config",   label: "Configuración", icon: Settings },
];

export default function AdminLayout() {
  const { token, user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  if (!token) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    logout();
    toast("Sesión cerrada.", {
      icon: "👋",
      style: {
        background: "#1e293b",
        color: "#e2e8f0",
        border: "1px solid rgba(255,255,255,0.08)",
        fontSize: "15px",
        padding: "14px 18px",
      },
    });
  };

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh", overflow: "hidden", background: "#020617" }}>

      {open && (
        <div
          className="backdrop-overlay"
          onClick={() => setOpen(false)}
          style={{ display: "block" }}
        />
      )}

      <aside
        className={`sidebar-wrapper ${open ? "open" : ""}`}
        style={{
          display: "flex",
          flexDirection: "column",
          background: "#0f172a",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "20px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              minWidth: "42px",
              borderRadius: "12px",
              background: "#6366f1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
            }}
          >
            <Music2 style={{ width: "22px", height: "22px", color: "#fff" }} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: "17px", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.3 }}>
              RockoCloud
            </p>
            <p style={{
              fontSize: "13px", color: "#64748b", lineHeight: 1.3, marginTop: "2px",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {user?.tenantName ?? "Panel Admin"}
            </p>
          </div>
          <button
            id="sidebar-close"
            onClick={() => setOpen(false)}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "8px",
              border: "none",
              background: "transparent",
              color: "#64748b",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X style={{ width: "18px", height: "18px" }} />
          </button>
        </div>

        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {NAV_ITEMS.map(({ to, label, icon: Icon, end, requireSuperAdmin }) => {
            if (requireSuperAdmin && user?.role !== 'SuperAdmin') return null;
            return (
              <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: 500,
                color: isActive ? "#a5b4fc" : "#94a3b8",
                background: isActive ? "rgba(99,102,241,0.12)" : "transparent",
                border: isActive ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
                transition: "all 0.2s ease",
                textDecoration: "none",
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    style={{
                      width: "20px",
                      height: "20px",
                      flexShrink: 0,
                      color: isActive ? "#a5b4fc" : "#64748b",
                    }}
                  />
                  <span style={{ flex: 1 }}>{label}</span>
                  {isActive && (
                    <ChevronRight style={{ width: "14px", height: "14px", color: "rgba(99,102,241,0.5)" }} />
                  )}
                </>
              )}
            </NavLink>
            );
          })}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 12px", marginBottom: "8px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                minWidth: "40px",
                borderRadius: "50%",
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: "16px", fontWeight: 700, color: "#a5b4fc" }}>
                {user?.email?.[0]?.toUpperCase() ?? "U"}
              </span>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{
                fontSize: "14px", fontWeight: 500, color: "#e2e8f0",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {user?.email}
              </p>
              <p style={{ fontSize: "12px", color: "#64748b", marginTop: "2px", textTransform: "capitalize" }}>
                {user?.role === 'SuperAdmin' ? 'Super Admin' : user?.role || 'Admin'}
              </p>
            </div>
          </div>
          <button
            id="logout-btn"
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1px solid transparent",
              background: "transparent",
              color: "#64748b",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: 500,
              textAlign: "left",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#f87171";
              e.currentTarget.style.background = "rgba(239,68,68,0.06)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#64748b";
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            <LogOut style={{ width: "18px", height: "18px" }} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div
        className="main-wrapper"
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "0 24px",
            height: "64px",
            minHeight: "64px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(2,6,23,0.9)",
            backdropFilter: "blur(12px)",
            position: "sticky",
            top: 0,
            zIndex: 20,
          }}
        >
          <button
            id="sidebar-open"
            onClick={() => setOpen(true)}
            className="hamburger-btn"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              border: "none",
              background: "transparent",
              color: "#94a3b8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#e2e8f0";
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#94a3b8";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <Menu style={{ width: "22px", height: "22px" }} />
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "16px", fontWeight: 600, color: "#e2e8f0" }}>
              {user?.tenantName ?? "RockoCloud"}
            </span>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#a5b4fc",
                padding: "4px 10px",
                borderRadius: "6px",
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.2)",
                textTransform: "capitalize",
              }}
            >
              {user?.role === 'SuperAdmin' ? 'Super Admin' : user?.role || 'Admin'}
            </span>
          </div>

          <div style={{ flex: 1 }} />

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                display: "inline-block",
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: "#34d399",
                boxShadow: "0 0 10px rgba(52,211,153,0.7)",
                animation: "pulse 2s infinite",
              }}
            />
            <span style={{ fontSize: "14px", color: "#64748b" }}>Conectado</span>
          </div>
        </header>

        <main
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            padding: "32px",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
