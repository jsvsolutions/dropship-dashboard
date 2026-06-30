"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Zap, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email ou senha incorretos.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      backgroundColor: "var(--bg-primary)",
    }}>
      <div style={{
        width: "360px", backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-dark)", borderRadius: "14px", padding: "36px",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px", justifyContent: "center" }}>
          <div style={{ width: "34px", height: "34px", backgroundColor: "var(--accent)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={18} color="#000" />
          </div>
          <span style={{ fontWeight: 700, fontSize: "18px", color: "var(--text-primary)" }}>DropDash</span>
        </div>

        <h1 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", textAlign: "center", marginBottom: "6px" }}>
          Entrar no painel
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", marginBottom: "24px" }}>
          Acesso restrito à equipe
        </p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={{
                width: "100%", backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border-dark)", borderRadius: "8px",
                padding: "10px 12px", fontSize: "13px", color: "var(--text-primary)", outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
              Senha
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: "100%", backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-dark)", borderRadius: "8px",
                  padding: "10px 36px 10px 12px", fontSize: "13px", color: "var(--text-primary)", outline: "none",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ backgroundColor: "#ef444422", border: "1px solid #ef4444", borderRadius: "7px", padding: "10px 12px", fontSize: "12px", color: "#ef4444", marginBottom: "14px" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "11px", backgroundColor: "var(--accent)",
              color: "#000", border: "none", borderRadius: "8px",
              fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
