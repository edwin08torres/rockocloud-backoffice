import axios from "axios";
import {
  Plus,
  Speaker,
  Wifi,
  WifiOff,
  X,
  Loader2,
  Copy,
  Check,
  Building2,
  KeyRound,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

import { useAuthStore } from "@/stores/useAuthStore";

const API_URL = import.meta.env.VITE_API_URL;

interface Device {
  id: string;
  name: string;
  branchId: string;
  tenantId: string;
  tenantName?: string;
  pairingPin: string | null;
  isActive: boolean;
  createdAt: string;
}

interface RegisterResponse {
  id: string;
  name: string;
  pairingPin: string;
  branchId: string;
}

interface Branch {
  id: string;
  name: string;
}

function CardSkeleton() {
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
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.04)",
            animation: "pulse 1.8s ease-in-out infinite",
          }}
        />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ width: "60%", height: "14px", borderRadius: "6px", background: "rgba(255,255,255,0.06)", animation: "pulse 1.8s ease-in-out infinite" }} />
          <div style={{ width: "40%", height: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.04)", animation: "pulse 1.8s ease-in-out infinite" }} />
        </div>
      </div>
      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />
      <div style={{ width: "30%", height: "12px", borderRadius: "6px", background: "rgba(255,255,255,0.04)", animation: "pulse 1.8s ease-in-out infinite" }} />
    </div>
  );
}

function DeviceCard({ device, isSuperAdmin }: { device: Device; isSuperAdmin: boolean }) {
  const [copied, setCopied] = useState(false);

  const copyPin = async () => {
    if (!device.pairingPin) return;
    await navigator.clipboard.writeText(device.pairingPin);
    setCopied(true);
    toast.success("PIN copiado al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        background: "#0f172a",
        border: `1px solid ${device.isActive ? "rgba(52,211,153,0.2)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        transition: "transform 0.3s ease, border-color 0.3s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.015)";
        e.currentTarget.style.borderColor = device.isActive
          ? "rgba(52,211,153,0.4)"
          : "rgba(99,102,241,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.borderColor = device.isActive
          ? "rgba(52,211,153,0.2)"
          : "rgba(255,255,255,0.08)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "48px",
            height: "48px",
            minWidth: "48px",
            borderRadius: "12px",
            background: device.isActive
              ? "rgba(52,211,153,0.1)"
              : "rgba(99,102,241,0.1)",
            border: `1px solid ${device.isActive ? "rgba(52,211,153,0.2)" : "rgba(99,102,241,0.2)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Speaker
            style={{
              width: "22px",
              height: "22px",
              color: device.isActive ? "#34d399" : "#818cf8",
            }}
          />
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
            {device.name}
          </p>
          {isSuperAdmin && device.tenantName && (
            <p
              style={{
                fontSize: "12px",
                color: "#64748b",
                marginTop: "2px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Building2 style={{ width: "12px", height: "12px" }} />
              {device.tenantName}
            </p>
          )}
        </div>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 600,
            background: device.isActive
              ? "rgba(52,211,153,0.1)"
              : "rgba(239,68,68,0.1)",
            color: device.isActive ? "#34d399" : "#f87171",
            border: `1px solid ${device.isActive ? "rgba(52,211,153,0.2)" : "rgba(239,68,68,0.2)"}`,
            flexShrink: 0,
          }}
        >
          {device.isActive ? (
            <Wifi style={{ width: "12px", height: "12px" }} />
          ) : (
            <WifiOff style={{ width: "12px", height: "12px" }} />
          )}
          {device.isActive ? "Activa" : "Inactiva"}
        </span>
      </div>

      <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

      {!device.isActive && device.pairingPin ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            padding: "14px 16px",
            borderRadius: "12px",
            background: "rgba(99,102,241,0.06)",
            border: "1px solid rgba(99,102,241,0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
            <KeyRound style={{ width: "16px", height: "16px", color: "#818cf8", flexShrink: 0 }} />
            <span
              style={{
                fontSize: "20px",
                fontWeight: 700,
                fontFamily: "'Courier New', Courier, monospace",
                color: "#a5b4fc",
                letterSpacing: "0.15em",
              }}
            >
              {device.pairingPin}
            </span>
          </div>
          <button
            onClick={copyPin}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "34px",
              height: "34px",
              borderRadius: "8px",
              border: "1px solid rgba(99,102,241,0.2)",
              background: "rgba(99,102,241,0.1)",
              color: copied ? "#34d399" : "#a5b4fc",
              cursor: "pointer",
              transition: "all 0.2s ease",
              flexShrink: 0,
            }}
          >
            {copied ? (
              <Check style={{ width: "16px", height: "16px" }} />
            ) : (
              <Copy style={{ width: "16px", height: "16px" }} />
            )}
          </button>
        </div>
      ) : (
        <p style={{ fontSize: "13px", color: "#475569" }}>
          {device.isActive
            ? "Conectada y operativa"
            : "Sin PIN de emparejamiento"}
        </p>
      )}
    </div>
  );
}

function RegisterModal({
  onClose,
  onRegistered,
}: {
  onClose: () => void;
  onRegistered: () => void;
}) {
  const { token } = useAuthStore();
  const [step, setStep] = useState<"form" | "pin">("form");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pinResult, setPinResult] = useState<RegisterResponse | null>(null);
  const [generatedPin, setGeneratedPin] = useState<string | null>(null);
  const [pinCopied, setPinCopied] = useState(false);

  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [loadingBranches, setLoadingBranches] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const { data } = await axios.get<Branch[]>(
          `${API_URL}/api/Devices/branches`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBranches(data);
        if (data.length > 0) setSelectedBranchId(data[0].id);
      } catch {
        toast.error("No se pudieron cargar las sucursales.");
      } finally {
        setLoadingBranches(false);
      }
    };
    fetchBranches();
  }, [token]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Ingresa un nombre para la rockola.");
      return;
    }
    if (!selectedBranchId) {
      toast.error("Selecciona una sucursal.");
      return;
    }
    setIsSubmitting(true);
    try {
      const { data } = await axios.post<any>(
        `${API_URL}/api/Devices/register`,
        {
          name: name.trim(),
          branchId: selectedBranchId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Respuesta cruda del backend:', data);

      const pinReal = data?.pin || data?.Pin || data?.PIN || data?.pairingPin;

      setPinResult(data);
      setGeneratedPin(pinReal || null);
      setStep("pin");
      toast.success("Rockola registrada con éxito");
    } catch (err: unknown) {
      let msg = "Error al registrar la rockola. Intenta de nuevo.";
      if (axios.isAxiosError(err) && err.response?.data) {
        const d = err.response.data;
        msg = typeof d === "string" ? d : d.message ?? d.title ?? d.detail ?? msg;
      }
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyPin = async () => {
    if (!generatedPin) {
      toast.error("El PIN no está disponible.");
      return;
    }
    await navigator.clipboard.writeText(generatedPin);
    setPinCopied(true);
    toast.success("PIN copiado");
    setTimeout(() => setPinCopied(false), 2000);
  };

  const handleClose = () => {
    if (step === "pin") onRegistered();
    onClose();
  };

  return (
    <div
      onClick={handleClose}
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
            {step === "form" ? "Registrar Nueva Rockola" : "PIN de Emparejamiento"}
          </h2>
          <button
            onClick={handleClose}
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

        <div style={{ padding: "28px 24px" }}>
          {step === "form" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              <div>
                <label
                  htmlFor="device-branch"
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#94a3b8",
                    marginBottom: "8px",
                  }}
                >
                  Sucursal
                </label>
                {loadingBranches ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "13px 16px",
                      borderRadius: "12px",
                      background: "rgba(30,41,59,0.8)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <Loader2
                      style={{ width: "16px", height: "16px", color: "#64748b", animation: "spin 1s linear infinite" }}
                    />
                    <span style={{ fontSize: "14px", color: "#64748b" }}>Cargando sucursales...</span>
                  </div>
                ) : branches.length === 0 ? (
                  <div
                    style={{
                      padding: "14px 16px",
                      borderRadius: "12px",
                      background: "rgba(234,179,8,0.06)",
                      border: "1px solid rgba(234,179,8,0.2)",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Building2 style={{ width: "16px", height: "16px", color: "#eab308", flexShrink: 0 }} />
                    <span style={{ fontSize: "13px", color: "#eab308", lineHeight: 1.4 }}>
                      Debes crear una sucursal primero desde la configuración.
                    </span>
                  </div>
                ) : (
                  <select
                    id="device-branch"
                    value={selectedBranchId}
                    onChange={(e) => setSelectedBranchId(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "13px 16px",
                      fontSize: "15px",
                      color: "#f1f5f9",
                      background: "rgba(30,41,59,0.8)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      outline: "none",
                      cursor: "pointer",
                      transition: "border-color 0.2s ease",
                      appearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 14px center",
                      paddingRight: "40px",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    }}
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id} style={{ background: "#1e293b", color: "#f1f5f9" }}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label
                  htmlFor="device-name"
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#94a3b8",
                    marginBottom: "8px",
                  }}
                >
                  Nombre del equipo
                </label>
                <input
                  id="device-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Barra Principal"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  style={{
                    width: "100%",
                    padding: "13px 16px",
                    fontSize: "15px",
                    color: "#f1f5f9",
                    background: "rgba(30,41,59,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting || branches.length === 0}
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
                  background: (isSubmitting || branches.length === 0)
                    ? "rgba(99,102,241,0.35)"
                    : "#6366f1",
                  border: "none",
                  borderRadius: "12px",
                  cursor: (isSubmitting || branches.length === 0) ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 24px rgba(99,102,241,0.3)",
                  transition: "all 0.2s ease",
                  opacity: branches.length === 0 ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting && branches.length > 0) e.currentTarget.style.background = "#818cf8";
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting && branches.length > 0) e.currentTarget.style.background = "#6366f1";
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2
                      style={{ width: "18px", height: "18px", animation: "spin 1s linear infinite" }}
                    />
                    Registrando...
                  </>
                ) : (
                  <>
                    <Plus style={{ width: "18px", height: "18px" }} />
                    Registrar Rockola
                  </>
                )}
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "24px",
                paddingTop: "8px",
                paddingBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "16px",
                  background: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <KeyRound style={{ width: "28px", height: "28px", color: "#a5b4fc" }} />
              </div>

              <p style={{ fontSize: "14px", color: "#64748b" }}>
                Rockola: <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{pinResult?.name}</span>
              </p>

              <div
                style={{
                  padding: "20px 32px",
                  borderRadius: "16px",
                  background: "rgba(99,102,241,0.08)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "56px",
                    fontWeight: 800,
                    fontFamily: "'Courier New', Courier, monospace",
                    color: "#a5b4fc",
                    letterSpacing: "0.25em",
                    lineHeight: 1.2,
                    userSelect: "all",
                  }}
                >
                  {generatedPin || '----'}
                </p>
              </div>

              <button
                onClick={copyPin}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: 500,
                  color: pinCopied ? "#34d399" : "#a5b4fc",
                  background: "rgba(99,102,241,0.08)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {pinCopied ? (
                  <>
                    <Check style={{ width: "16px", height: "16px" }} />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy style={{ width: "16px", height: "16px" }} />
                    Copiar PIN
                  </>
                )}
              </button>

              <p
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  textAlign: "center",
                  lineHeight: 1.6,
                  maxWidth: "340px",
                }}
              >
                Ve a la aplicación de la Rockola en la computadora física e ingresa
                este código para vincularla.
              </p>

              <button
                onClick={handleClose}
                style={{
                  width: "100%",
                  padding: "13px 24px",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "#e2e8f0",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  marginTop: "4px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                }}
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Devices() {
  const { token, user } = useAuthStore();
  const isSuperAdmin = user?.role === "SuperAdmin";

  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchDevices = useCallback(async () => {
    try {
      const { data } = await axios.get<Device[]>(`${API_URL}/api/Devices`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDevices(data);
    } catch {
      toast.error("No se pudieron cargar las rockolas.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const handleRegistered = () => {
    fetchDevices();
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
            Mis Rockolas
          </h1>
          <p style={{ fontSize: "15px", color: "#64748b", marginTop: "6px" }}>
            Gestiona tus equipos y vincula nuevas rockolas.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#fff",
            background: "#6366f1",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
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
          <Plus style={{ width: "18px", height: "18px" }} />
          Registrar Nueva Rockola
        </button>
      </div>

      {loading ? (
        <div className="devices-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : devices.length === 0 ? (
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
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Speaker style={{ width: "32px", height: "32px", color: "#818cf8" }} />
          </div>
          <div>
            <p style={{ fontSize: "18px", fontWeight: 600, color: "#e2e8f0", marginBottom: "6px" }}>
              Aún no tienes rockolas
            </p>
            <p style={{ fontSize: "14px", color: "#64748b", maxWidth: "320px" }}>
              Registra tu primera rockola para empezar a gestionar tu catálogo musical.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
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
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#818cf8";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#6366f1";
            }}
          >
            <Plus style={{ width: "18px", height: "18px" }} />
            Registrar Primera Rockola
          </button>
        </div>
      ) : (
        <div className="devices-grid">
          {devices.map((device) => (
            <DeviceCard key={device.id} device={device} isSuperAdmin={isSuperAdmin} />
          ))}
        </div>
      )}

      {showModal && (
        <RegisterModal
          onClose={() => setShowModal(false)}
          onRegistered={handleRegistered}
        />
      )}
    </div>
  );
}
