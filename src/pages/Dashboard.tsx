import { LayoutDashboard, TrendingUp, Speaker, Music } from "lucide-react";

const stats = [
  {
    label: "Rockolas Activas",
    value: "—",
    icon: Speaker,
    iconColor: "#818cf8",
    iconBg: "rgba(99,102,241,0.12)",
    iconBorder: "rgba(99,102,241,0.22)",
  },
  {
    label: "Canciones en Cola",
    value: "—",
    icon: Music,
    iconColor: "#c084fc",
    iconBg: "rgba(192,132,252,0.12)",
    iconBorder: "rgba(192,132,252,0.22)",
  },
  {
    label: "Reproducciones Hoy",
    value: "—",
    icon: TrendingUp,
    iconColor: "#34d399",
    iconBg: "rgba(52,211,153,0.12)",
    iconBorder: "rgba(52,211,153,0.22)",
  },
  {
    label: "Total Canciones",
    value: "—",
    icon: LayoutDashboard,
    iconColor: "#38bdf8",
    iconBg: "rgba(56,189,248,0.12)",
    iconBorder: "rgba(56,189,248,0.22)",
  },
];

export default function Dashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

      <div>
        <h1 style={{ fontSize: "26px", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.2 }}>
          Dashboard
        </h1>
        <p style={{ fontSize: "15px", color: "#64748b", marginTop: "8px", lineHeight: 1.5 }}>
          Resumen general de tu operación en tiempo real.
        </p>
      </div>

      <div className="stats-grid">
        {stats.map(({ label, value, icon: Icon, iconColor, iconBg, iconBorder }) => (
          <div
            key={label}
            style={{
              background: "#0f172a",
              border: `1px solid ${iconBorder}`,
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              transition: "transform 0.3s ease, border-color 0.3s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.borderColor = iconColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.borderColor = iconBorder;
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
              <p style={{ fontSize: "14px", fontWeight: 500, color: "#64748b", lineHeight: 1.4 }}>
                {label}
              </p>
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  minWidth: "46px",
                  borderRadius: "12px",
                  background: iconBg,
                  border: `1px solid ${iconBorder}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon style={{ width: "22px", height: "22px", color: iconColor }} />
              </div>
            </div>

            <p style={{ fontSize: "44px", fontWeight: 700, color: "#f1f5f9", lineHeight: 1, letterSpacing: "-0.02em" }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#0f172a",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "16px",
          padding: "64px 24px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "15px", color: "#475569" }}>
          Conecta tus módulos para ver datos en tiempo real →{" "}
          <span style={{ color: "#818cf8", fontWeight: 600 }}>Mis Rockolas</span>
        </p>
      </div>
    </div>
  );
}
