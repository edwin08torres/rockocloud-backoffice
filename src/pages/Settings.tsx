import axios from "axios";
import {
  Store,
  Plus,
  User,
  Shield,
  Hash,
  Mail,
  X,
  Loader2,
  MapPin,
  Building2,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

import { useAuthStore } from "@/stores/useAuthStore";

const API_URL = import.meta.env.VITE_API_URL;

interface Branch {
  id: string;
  name: string;
}

function BranchSkeleton() {
  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.04)",
          animation: "pulse 1.8s ease-in-out infinite",
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ width: "55%", height: "14px", borderRadius: "6px", background: "rgba(255,255,255,0.06)", animation: "pulse 1.8s ease-in-out infinite" }} />
        <div style={{ width: "35%", height: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.04)", animation: "pulse 1.8s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

function BranchCard({ branch }: { branch: Branch }) {
  const truncatedId = branch.id.length > 12
    ? `${branch.id.slice(0, 8)}…${branch.id.slice(-4)}`
    : branch.id;

  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        transition: "transform 0.3s ease, border-color 0.3s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.015)";
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
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
        <Store style={{ width: "22px", height: "22px", color: "#818cf8" }} />
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
          {branch.name}
        </p>
        <p
          style={{
            fontSize: "12px",
            color: "#475569",
            marginTop: "4px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontFamily: "'Courier New', Courier, monospace",
          }}
        >
          <Hash style={{ width: "11px", height: "11px" }} />
          {truncatedId}
        </p>
      </div>
    </div>
  );
}

function CreateBranchModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { token } = useAuthStore();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Ingresa un nombre para la sucursal.");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(
        `${API_URL}/api/Branches`,
        {
          name: name.trim(),
          address: address.trim() || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Sucursal creada con éxito");
      onCreated();
      onClose();
    } catch (err: unknown) {
      let msg = "Error al crear la sucursal.";
      if (axios.isAxiosError(err) && err.response?.data) {
        const d = err.response.data;
        msg = typeof d === "string" ? d : d.message ?? d.title ?? d.detail ?? msg;
      }
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "480px",
          background: "#0f172a",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "20px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#f1f5f9" }}>
            Nueva Sucursal
          </h2>
          <button
            onClick={onClose}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: "none",
              background: "rgba(255,255,255,0.05)",
              color: "#94a3b8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "#e2e8f0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.color = "#94a3b8";
            }}
          >
            <X style={{ width: "16px", height: "16px" }} />
          </button>
        </div>

        <div style={{ padding: "28px 24px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label
              htmlFor="branch-name"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#94a3b8",
                marginBottom: "8px",
              }}
            >
              <Building2 style={{ width: "14px", height: "14px" }} />
              Nombre *
            </label>
            <input
              id="branch-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Sucursal Centro"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{
                width: "100%",
                padding: "13px 16px",
                fontSize: "15px",
                color: "#f1f5f9",
                background: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
          </div>

          <div>
            <label
              htmlFor="branch-address"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
                fontWeight: 500,
                color: "#94a3b8",
                marginBottom: "8px",
              }}
            >
              <MapPin style={{ width: "14px", height: "14px" }} />
              Dirección <span style={{ color: "#475569", fontWeight: 400 }}>(opcional)</span>
            </label>
            <input
              id="branch-address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ej. Av. Revolución 1234, Col. Centro"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              style={{
                width: "100%",
                padding: "13px 16px",
                fontSize: "15px",
                color: "#f1f5f9",
                background: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "14px 24px",
              fontSize: "15px",
              fontWeight: 600,
              color: "#fff",
              background: isSubmitting ? "rgba(99,102,241,0.35)" : "#6366f1",
              border: "none",
              borderRadius: "12px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              boxShadow: "0 4px 24px rgba(99,102,241,0.3)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.currentTarget.style.background = "#818cf8";
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.currentTarget.style.background = "#6366f1";
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 style={{ width: "18px", height: "18px", animation: "spin 1s linear infinite" }} />
                Creando...
              </>
            ) : (
              <>
                <Plus style={{ width: "18px", height: "18px" }} />
                Crear Sucursal
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  const { user } = useAuthStore();

  const rows = [
    { label: "Correo electrónico", value: user?.email ?? "—", icon: Mail, color: "#818cf8" },
    { label: "Rol", value: user?.role ?? "—", icon: Shield, color: "#34d399" },
    { label: "ID de usuario", value: user?.id ?? "—", icon: Hash, color: "#f59e0b", mono: true },
    { label: "Tenant", value: user?.tenantName ?? "—", icon: Building2, color: "#38bdf8" },
  ];

  return (
    <div
      style={{
        background: "#0f172a",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      {rows.map(({ label, value, icon: Icon, color, mono }, i) => (
        <div
          key={label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "20px 24px",
            borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              minWidth: "40px",
              borderRadius: "10px",
              background: `${color}15`,
              border: `1px solid ${color}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon style={{ width: "18px", height: "18px", color }} />
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontSize: "12px", fontWeight: 500, color: "#64748b", marginBottom: "2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {label}
            </p>
            <p
              style={{
                fontSize: "15px",
                fontWeight: 500,
                color: "#e2e8f0",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontFamily: mono ? "'Courier New', Courier, monospace" : "inherit",
              }}
            >
              {value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function BranchesTab() {
  const { token } = useAuthStore();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchBranches = useCallback(async () => {
    try {
      const { data } = await axios.get<Branch[]>(
        `${API_URL}/api/Devices/branches`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBranches(data);
    } catch {
      toast.error("No se pudieron cargar las sucursales.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <p style={{ fontSize: "15px", color: "#94a3b8" }}>
          Administra los locales físicos donde operan tus rockolas.
        </p>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 18px",
            fontSize: "13px",
            fontWeight: 600,
            color: "#fff",
            background: "#6366f1",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
            transition: "all 0.2s ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#818cf8";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#6366f1";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <Plus style={{ width: "16px", height: "16px" }} />
          Nueva Sucursal
        </button>
      </div>

      {loading ? (
        <div className="branches-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <BranchSkeleton key={i} />
          ))}
        </div>
      ) : branches.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            padding: "72px 24px",
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Store style={{ width: "28px", height: "28px", color: "#818cf8" }} />
          </div>
          <div>
            <p style={{ fontSize: "17px", fontWeight: 600, color: "#e2e8f0", marginBottom: "6px" }}>
              Sin sucursales
            </p>
            <p style={{ fontSize: "14px", color: "#64748b", maxWidth: "300px" }}>
              Crea tu primera sucursal para poder registrar rockolas en ella.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "11px 22px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
              background: "#6366f1",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
              transition: "all 0.2s ease",
              marginTop: "4px",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#818cf8"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#6366f1"; }}
          >
            <Plus style={{ width: "16px", height: "16px" }} />
            Crear Primera Sucursal
          </button>
        </div>
      ) : (
        <div className="branches-grid">
          {branches.map((b) => (
            <BranchCard key={b.id} branch={b} />
          ))}
        </div>
      )}

      {showModal && (
        <CreateBranchModal
          onClose={() => setShowModal(false)}
          onCreated={fetchBranches}
        />
      )}
    </div>
  );
}

type TabKey = "branches" | "profile";

const TABS: { key: TabKey; label: string; icon: typeof Store }[] = [
  { key: "branches", label: "Sucursales", icon: Store },
  { key: "profile", label: "Perfil", icon: User },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabKey>("branches");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <div>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.2 }}>
          Configuración
        </h1>
        <p style={{ fontSize: "15px", color: "#64748b", marginTop: "6px" }}>
          Administra tu cuenta, sucursales y preferencias del sistema.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "4px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          paddingBottom: "0px",
        }}
      >
        {TABS.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 20px",
                fontSize: "14px",
                fontWeight: 500,
                color: isActive ? "#a5b4fc" : "#64748b",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${isActive ? "#6366f1" : "transparent"}`,
                cursor: "pointer",
                transition: "all 0.2s ease",
                marginBottom: "-1px",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "#94a3b8";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "#64748b";
              }}
            >
              <Icon style={{ width: "16px", height: "16px" }} />
              {label}
            </button>
          );
        })}
      </div>

      <div>
        {activeTab === "branches" && <BranchesTab />}
        {activeTab === "profile" && <ProfileTab />}
      </div>
    </div>
  );
}
