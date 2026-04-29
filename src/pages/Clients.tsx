import axios from "axios";
import {
  Building2,
  Plus,
  Power,
  CalendarDays,
  Hash,
  X,
  Loader2,
  Mail,
  Lock,
  Clock,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

import { useAuthStore } from "@/stores/useAuthStore";

const API_URL = import.meta.env.VITE_API_URL;

interface Tenant {
  id: string;
  name: string;
  subscriptionEndDate: string;
  status: string;
  isExpired: boolean;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; border: string; glow: string }> = {
  Active: {
    label: "Activo",
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.2)",
    glow: "rgba(52,211,153,0.8)",
  },
  Suspended: {
    label: "Suspendido",
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.1)",
    border: "rgba(251,191,36,0.2)",
    glow: "rgba(251,191,36,0.8)",
  },
  Blocked: {
    label: "Bloqueado",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.2)",
    glow: "rgba(239,68,68,0.8)",
  },
};

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-CR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
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

function ClientCard({ tenant, onRenew }: { tenant: Tenant; onRenew: (t: Tenant) => void }) {
  const statusInfo = STATUS_MAP[tenant.status] ?? STATUS_MAP.Active;

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
              flexWrap: "wrap",
            }}
          >
            <p style={{ display: "flex", alignItems: "center", gap: "4px", fontFamily: "'Courier New', Courier, monospace" }}>
              <Hash style={{ width: "11px", height: "11px" }} />
              {truncatedId}
            </p>
            <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#475569" }} />
            <p style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <CalendarDays style={{ width: "11px", height: "11px" }} />
              Vence: {formatDate(tenant.subscriptionEndDate)}
            </p>
          </div>
        </div>
      </div>

      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              background: statusInfo.bg,
              border: `1px solid ${statusInfo.border}`,
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
              color: statusInfo.color,
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: statusInfo.color,
                boxShadow: `0 0 6px ${statusInfo.glow}`,
              }}
            />
            {statusInfo.label}
          </span>

          {tenant.isExpired && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "3px 8px",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.15)",
                borderRadius: "20px",
                fontSize: "11px",
                fontWeight: 600,
                color: "#f87171",
              }}
            >
              <AlertTriangle style={{ width: "10px", height: "10px" }} />
              Plan Vencido
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => onRenew(tenant)}
            title="Renovar plan"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(52,211,153,0.05)",
              border: "1px solid rgba(52,211,153,0.15)",
              color: "#34d399",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(52,211,153,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(52,211,153,0.05)";
            }}
          >
            <RefreshCw style={{ width: "15px", height: "15px" }} />
          </button>
          <button
            onClick={handleToggle}
            title="Suspender / Reactivar cuenta"
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(239,68,68,0.05)",
              border: "1px solid rgba(239,68,68,0.15)",
              color: "#f87171",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.05)";
            }}
          >
            <Power style={{ width: "16px", height: "16px" }} />
          </button>
        </div>
      </div>
    </div>
  );
}

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "rgba(0,0,0,0.3)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  padding: "12px 14px 12px 42px",
  fontSize: "14px",
  color: "#e2e8f0",
  outline: "none",
  transition: "border-color 0.2s ease",
};

const LABEL_STYLE: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  color: "#94a3b8",
  marginBottom: "8px",
};

const ICON_STYLE: React.CSSProperties = {
  position: "absolute",
  left: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  width: "16px",
  height: "16px",
  color: "#64748b",
  pointerEvents: "none",
};

export default function Clients() {
  const { token } = useAuthStore();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    months: 1,
    adminEmail: "",
    adminPassword: "",
  });

  const [renewTarget, setRenewTarget] = useState<Tenant | null>(null);
  const [renewMonths, setRenewMonths] = useState(1);
  const [renewing, setRenewing] = useState(false);

  const fetchTenants = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<Tenant[]>(`${API_URL}/api/Tenants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTenants(data.filter((t) => t.name !== "DETDevs Master"));
    } catch {
      toast.error("Error al cargar la lista de clientes.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const resetForm = () => {
    setFormData({ businessName: "", months: 1, adminEmail: "", adminPassword: "" });
  };

  const openModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!formData.businessName.trim()) {
      toast.error("El nombre del negocio es requerido.");
      return;
    }
    if (!formData.adminEmail.trim()) {
      toast.error("El correo del administrador es requerido.");
      return;
    }
    if (!formData.adminPassword.trim() || formData.adminPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setSaving(true);
      await axios.post(
        `${API_URL}/api/Tenants/register`,
        {
          businessName: formData.businessName.trim(),
          months: formData.months,
          adminEmail: formData.adminEmail.trim(),
          adminPassword: formData.adminPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Cliente registrado exitosamente.");
      setModalOpen(false);
      resetForm();
      fetchTenants();
    } catch (err: unknown) {
      let msg = "Error al registrar el cliente.";
      if (axios.isAxiosError(err)) {
        const d = err.response?.data;
        msg = d?.message ?? d?.title ?? d?.detail ?? msg;
      }
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const openRenewModal = (t: Tenant) => {
    setRenewTarget(t);
    setRenewMonths(1);
  };

  const closeRenewModal = () => {
    if (renewing) return;
    setRenewTarget(null);
  };

  const handleRenew = async () => {
    if (!renewTarget) return;
    try {
      setRenewing(true);
      await axios.post(
        `${API_URL}/api/Tenants/${renewTarget.id}/renew`,
        { months: renewMonths },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Plan de "${renewTarget.name}" renovado por ${renewMonths} mes(es).`);
      setRenewTarget(null);
      fetchTenants();
    } catch (err: unknown) {
      let msg = "Error al renovar el plan.";
      if (axios.isAxiosError(err)) {
        const d = err.response?.data;
        msg = d?.message ?? d?.title ?? d?.detail ?? msg;
      }
      toast.error(msg);
    } finally {
      setRenewing(false);
    }
  };

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
          onClick={openModal}
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
            <ClientCard key={t.id} tenant={t} onRenew={openRenewModal} />
          ))}
        </div>
      )}

      {modalOpen && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "480px",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div>
                <p style={{ fontSize: "17px", fontWeight: 600, color: "#f1f5f9" }}>Registrar Nuevo Cliente</p>
                <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
                  Completa los datos del nuevo tenant
                </p>
              </div>
              <button
                onClick={closeModal}
                disabled={saving}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  border: "none",
                  background: "rgba(255,255,255,0.05)",
                  color: "#94a3b8",
                  cursor: saving ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  opacity: saving ? 0.4 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!saving) e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
              >
                <X style={{ width: "16px", height: "16px" }} />
              </button>
            </div>

            <div
              style={{
                padding: "24px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <div>
                <label style={LABEL_STYLE}>Nombre del Negocio</label>
                <div style={{ position: "relative" }}>
                  <Building2 style={ICON_STYLE} />
                  <input
                    type="text"
                    placeholder="Ej: Bar La Esquina"
                    value={formData.businessName}
                    disabled={saving}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    style={{ ...INPUT_STYLE, opacity: saving ? 0.5 : 1 }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                  />
                </div>
              </div>

              <div>
                <label style={LABEL_STYLE}>Plan de Suscripción</label>
                <div style={{ position: "relative" }}>
                  <Clock style={ICON_STYLE} />
                  <select
                    value={formData.months}
                    disabled={saving}
                    onChange={(e) => setFormData({ ...formData, months: Number(e.target.value) })}
                    style={{
                      ...INPUT_STYLE,
                      appearance: "none",
                      cursor: "pointer",
                      opacity: saving ? 0.5 : 1,
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                      paddingRight: "40px",
                    }}
                  >
                    <option value={1}>1 Mes</option>
                    <option value={6}>6 Meses</option>
                    <option value={12}>12 Meses</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={LABEL_STYLE}>Correo del Administrador</label>
                <div style={{ position: "relative" }}>
                  <Mail style={ICON_STYLE} />
                  <input
                    type="email"
                    placeholder="admin@negocio.com"
                    value={formData.adminEmail}
                    disabled={saving}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    style={{ ...INPUT_STYLE, opacity: saving ? 0.5 : 1 }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                  />
                </div>
              </div>

              <div>
                <label style={LABEL_STYLE}>Contraseña Inicial</label>
                <div style={{ position: "relative" }}>
                  <Lock style={ICON_STYLE} />
                  <input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={formData.adminPassword}
                    disabled={saving}
                    onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                    style={{ ...INPUT_STYLE, opacity: saving ? 0.5 : 1 }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                padding: "16px 24px 20px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={closeModal}
                disabled={saving}
                style={{
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#94a3b8",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  cursor: saving ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  opacity: saving ? 0.4 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!saving) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 24px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: saving ? "rgba(255,255,255,0.7)" : "#fff",
                  background: saving ? "rgba(99,102,241,0.5)" : "#6366f1",
                  border: "none",
                  borderRadius: "10px",
                  cursor: saving ? "not-allowed" : "pointer",
                  boxShadow: saving ? "none" : "0 4px 16px rgba(99,102,241,0.35)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!saving) e.currentTarget.style.background = "#4f46e5";
                }}
                onMouseLeave={(e) => {
                  if (!saving) e.currentTarget.style.background = "#6366f1";
                }}
              >
                {saving ? (
                  <>
                    <Loader2 style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} />
                    Guardando...
                  </>
                ) : (
                  "Registrar Cliente"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {renewTarget && (
        <div
          onClick={closeRenewModal}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#0f172a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "420px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div>
                <p style={{ fontSize: "17px", fontWeight: 600, color: "#f1f5f9" }}>Renovar Plan</p>
                <p style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
                  {renewTarget.name}
                </p>
              </div>
              <button
                onClick={closeRenewModal}
                disabled={renewing}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  border: "none",
                  background: "rgba(255,255,255,0.05)",
                  color: "#94a3b8",
                  cursor: renewing ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: renewing ? 0.4 : 1,
                }}
              >
                <X style={{ width: "16px", height: "16px" }} />
              </button>
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <p style={{ fontSize: "14px", color: "#94a3b8" }}>
                ¿Por cuántos meses deseas renovar el plan?
              </p>
              <div style={{ position: "relative" }}>
                <Clock style={ICON_STYLE} />
                <select
                  value={renewMonths}
                  disabled={renewing}
                  onChange={(e) => setRenewMonths(Number(e.target.value))}
                  style={{
                    ...INPUT_STYLE,
                    appearance: "none",
                    cursor: "pointer",
                    opacity: renewing ? 0.5 : 1,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 14px center",
                    paddingRight: "40px",
                  }}
                >
                  <option value={1}>1 Mes</option>
                  <option value={6}>6 Meses</option>
                  <option value={12}>12 Meses</option>
                </select>
              </div>
            </div>

            <div
              style={{
                padding: "16px 24px 20px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={closeRenewModal}
                disabled={renewing}
                style={{
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#94a3b8",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  cursor: renewing ? "not-allowed" : "pointer",
                  opacity: renewing ? 0.4 : 1,
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleRenew}
                disabled={renewing}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 24px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: renewing ? "rgba(255,255,255,0.7)" : "#fff",
                  background: renewing ? "rgba(52,211,153,0.4)" : "#059669",
                  border: "none",
                  borderRadius: "10px",
                  cursor: renewing ? "not-allowed" : "pointer",
                  boxShadow: renewing ? "none" : "0 4px 16px rgba(5,150,105,0.35)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!renewing) e.currentTarget.style.background = "#047857";
                }}
                onMouseLeave={(e) => {
                  if (!renewing) e.currentTarget.style.background = "#059669";
                }}
              >
                {renewing ? (
                  <>
                    <Loader2 style={{ width: "16px", height: "16px", animation: "spin 1s linear infinite" }} />
                    Renovando...
                  </>
                ) : (
                  <>
                    <RefreshCw style={{ width: "15px", height: "15px" }} />
                    Confirmar Renovación
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
