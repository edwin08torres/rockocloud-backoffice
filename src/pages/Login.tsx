import { Loader2, Music2, Mail, Lock } from "lucide-react";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../stores/useAuthStore";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("¡Bienvenido de vuelta!", {
        style: {
          background: "#1e293b",
          color: "#e2e8f0",
          border: "1px solid rgba(99,102,241,0.4)",
          fontSize: "15px",
          padding: "14px 18px",
        },
        iconTheme: { primary: "#6366f1", secondary: "#e2e8f0" },
      });
      navigate("/");
    } catch {
      toast.error("Credenciales inválidas. Verifica tu email y contraseña.", {
        style: {
          background: "#1e293b",
          color: "#e2e8f0",
          border: "1px solid rgba(239,68,68,0.4)",
          fontSize: "15px",
          padding: "14px 18px",
        },
        iconTheme: { primary: "#ef4444", secondary: "#e2e8f0" },
      });
    }
  };

  return (
    <div
      style={{ minHeight: "100svh" }}
      className="relative bg-slate-950 flex items-center justify-center px-6 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(circle, #6366f1 1.5px, transparent 1.5px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full" style={{ maxWidth: "460px" }}>

        <div
          className="flex flex-col items-center"
          style={{ marginBottom: "36px" }}
        >
          <div
            className="flex items-center justify-center rounded-2xl bg-indigo-600"
            style={{
              width: "64px",
              height: "64px",
              marginBottom: "16px",
              boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
            }}
          >
            <Music2 style={{ width: "32px", height: "32px", color: "white" }} />
          </div>
          <h1
            className="text-slate-100 font-semibold tracking-tight"
            style={{ fontSize: "28px", lineHeight: "1.2" }}
          >
            RockoCloud
          </h1>
          <p
            className="text-slate-400"
            style={{ fontSize: "15px", marginTop: "6px" }}
          >
            Panel de Administración
          </p>
        </div>

        <div
          className="bg-slate-900 border border-white/[0.08] rounded-2xl"
          style={{
            padding: "36px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
          }}
        >
          <h2
            className="text-slate-100 font-semibold"
            style={{ fontSize: "20px", marginBottom: "28px" }}
          >
            Iniciar sesión
          </h2>

          <form id="login-form" onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="email"
                className="text-slate-400 font-medium"
                style={{
                  display: "block",
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                Correo electrónico
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  className="text-slate-500"
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "18px",
                    height: "18px",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@rockocloud.com"
                  className="text-slate-100 placeholder-slate-600 transition-all duration-200 outline-none focus:border-indigo-500"
                  style={{
                    width: "100%",
                    background: "rgba(30,41,59,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    paddingLeft: "46px",
                    paddingRight: "16px",
                    paddingTop: "13px",
                    paddingBottom: "13px",
                    fontSize: "15px",
                    lineHeight: "1.5",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label
                htmlFor="password"
                className="text-slate-400 font-medium"
                style={{
                  display: "block",
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                Contraseña
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  className="text-slate-500"
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "18px",
                    height: "18px",
                    pointerEvents: "none",
                  }}
                />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="text-slate-100 placeholder-slate-600 transition-all duration-200 outline-none focus:border-indigo-500"
                  style={{
                    width: "100%",
                    background: "rgba(30,41,59,0.8)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    paddingLeft: "46px",
                    paddingRight: "16px",
                    paddingTop: "13px",
                    paddingBottom: "13px",
                    fontSize: "15px",
                    lineHeight: "1.5",
                  }}
                />
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="transition-all duration-200 ease-in-out hover:brightness-110 active:scale-[0.98]"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                background: isLoading
                  ? "rgba(99,102,241,0.6)"
                  : "rgb(99,102,241)",
                color: "white",
                fontWeight: "600",
                fontSize: "15px",
                borderRadius: "12px",
                padding: "14px 24px",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 24px rgba(99,102,241,0.3)",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 style={{ width: "18px", height: "18px" }} className="animate-spin" />
                  Verificando...
                </>
              ) : (
                "Ingresar al panel"
              )}
            </button>
          </form>
        </div>

        <p
          className="text-slate-600 text-center"
          style={{ fontSize: "13px", marginTop: "24px" }}
        >
          © {new Date().getFullYear()} RockoCloud · Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
