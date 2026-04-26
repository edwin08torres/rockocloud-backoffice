import axios from "axios";
import {
  Building2,
  Plus,
  Power,
  CalendarDays,
  Hash,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

import { useAuthStore } from "../stores/useAuthStore";

const API_URL = "http://localhost:5165";


interface Tenant {
  id: string;
  name: string;
  // Si tu backend aún no manda estos campos, los vamos a mockear
  createdAt?: string;
  isActive?: boolean;
}


function ClientSkeleton() {
  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", animation: "pulse 1.8s infinite" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ width: "60%", height: "14px", borderRadius: "6px", background: "rgba(255,255,255,0.06)", animation: "pulse 1.8s infinite" }} />
          <div style={{ width: "40%", height: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.04)", animation: "pulse 1.8s infinite" }} />
        </div>
      </div>
      <div style={{ height: "1px", background: "rgba(255,255,255,0.04)" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ width: "80px", height: "24px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", animation: "pulse 1.8s infinite" }} />
        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", animation: "pulse 1.8s infinite" }} />
      </div>
    </div>
  );
}


function ClientCard({ tenant }: { tenant: Tenant }) {
  // Simulamos datos si no vienen de la API
  const createdAt = tenant.createdAt ?? "15 Sep 2023";
  const isActive = tenant.isActive ?? true;

  const truncatedId = tenant.id.length > 12
    ? `${tenant.id.slice(0, 8)}…${tenant.id.slice(-4)}`
    : tenant.id;

  const handleToggle = () => {
    toast("Endpoint de suspensión en construcción.", {
      icon: "🚧",
      style: {
        background: "#1e293b",
        color: "#e2e8f0",
        border: "1px solid rgba(255,255,255,0.1)",
      },
    });
  };

  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        transition: "transform 0.3s ease, border-color 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            minWidth: "48px",
            borderRadius: "12px",
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Building2 style={{ width: "22px", height: "22px", color: "#818cf8" }} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <p
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#f1f5f9",
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {tenant.name}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginTop: "6px",
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            <p style={{ display: "flex", alignItems: "center", gap: "4px", fontFamily: "'Courier New', Courier, monospace" }}>
              <Hash style={{ width: "11px", height: "11px" }} />
              {truncatedId}
            </p>
            <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#475569" }} />
            <p style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <CalendarDays style={{ width: "11px", height: "11px" }} />
              {createdAt}
            </p>
          </div>
        </div>
      </div>

      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 10px",
            background: isActive ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${isActive ? "rgba(52,211,153,0.2)" : "rgba(239,68,68,0.2)"}`,
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 600,
            color: isActive ? "#34d399" : "#ef4444",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: isActive ? "#34d399" : "#ef4444",
              boxShadow: `0 0 6px ${isActive ? "rgba(52,211,153,0.8)" : "rgba(239,68,68,0.8)"}`,
            }}
          />
          {isActive ? "Activo" : "Suspendido"}
        </span>

        <button
          onClick={handleToggle}
          title={isActive ? "Suspender cuenta" : "Reactivar cuenta"}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: isActive ? "rgba(239,68,68,0.05)" : "rgba(52,211,153,0.05)",
            border: `1px solid ${isActive ? "rgba(239,68,68,0.15)" : "rgba(52,211,153,0.15)"}`,
            color: isActive ? "#f87171" : "#34d399",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isActive ? "rgba(239,68,68,0.15)" : "rgba(52,211,153,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isActive ? "rgba(239,68,68,0.05)" : "rgba(52,211,153,0.05)";
          }}
        >
          <Power style={{ width: "16px", height: "16px" }} />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════
   CLIENTS PAGE (SuperAdmin)
═══════════════════════════ */

export default function Clients() {
  const { token } = useAuthStore();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTenants = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<Tenant[]>(`${API_URL}/api/Tenants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTenants(data);
    } catch {
      toast.error("Error al cargar la lista de clientes.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.2 }}>
            Gestión de Clientes
          </h1>
          <p style={{ fontSize: "15px", color: "#64748b", marginTop: "6px" }}>
            Administra los dueños de bares registrados en la plataforma.
          </p>
        </div>

        <button
          onClick={() => {
            toast("Modal de creación en construcción", { icon: "🚧", style: { background: "#1e293b", color: "#e2e8f0" } });
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#1e293b",
            background: "#f1f5f9",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(255,255,255,0.15)",
            transition: "all 0.2s ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f1f5f9";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <Plus style={{ width: "18px", height: "18px" }} />
          Nuevo Cliente
        </button>
      </div>

      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <ClientSkeleton key={i} />
          ))}
        </div>
      ) : tenants.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            padding: "80px 24px",
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Building2 style={{ width: "32px", height: "32px", color: "#94a3b8" }} />
          </div>
          <div>
            <p style={{ fontSize: "18px", fontWeight: 600, color: "#e2e8f0", marginBottom: "6px" }}>
              Sin clientes registrados
            </p>
            <p style={{ fontSize: "14px", color: "#64748b", maxWidth: "340px" }}>
              El sistema multi-tenant está vacío. Agrega tu primer cliente para comenzar.
            </p>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "20px",
          }}
        >
          {tenants.map((t) => (
            <ClientCard key={t.id} tenant={t} />
          ))}
        </div>
      )}
    </div>
  );
}
