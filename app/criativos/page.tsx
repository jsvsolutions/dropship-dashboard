"use client";

import { useState, useEffect } from "react";
import { Plus, X, Star, Link, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Criativo = {
  id: string;
  titulo: string;
  produto: string;
  tipo: string;
  plataforma: string;
  copy: string;
  ctr: string;
  cpa: string;
  roas: string;
  status: string;
  url: string;
};

const STATUS_COLORS: Record<string, string> = { vencedor: "#f59e0b", ativo: "#22c55e", pausado: "#555570" };
const STATUS_BG: Record<string, string> = { vencedor: "#f59e0b22", ativo: "#22c55e22", pausado: "#55557022" };

const EMPTY_FORM = { titulo: "", produto: "", tipo: "imagem", plataforma: "facebook", copy: "", ctr: "", cpa: "", roas: "", status: "ativo", url: "" };

export default function CriativosPage() {
  const [criativos, setCriativos] = useState<Criativo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [expandedCopy, setExpandedCopy] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const supabase = createClient();

  useEffect(() => { loadCriativos(); }, []);

  async function loadCriativos() {
    const { data } = await supabase.from("criativos").select("*").order("created_at", { ascending: false });
    if (data) setCriativos(data);
    setLoading(false);
  }

  async function addCriativo() {
    if (!form.titulo.trim()) return;
    const { data } = await supabase.from("criativos").insert([form]).select().single();
    if (data) setCriativos((prev) => [data, ...prev]);
    setShowModal(false);
    setForm(EMPTY_FORM);
  }

  async function removeCriativo(id: string) {
    await supabase.from("criativos").delete().eq("id", id);
    setCriativos((prev) => prev.filter((c) => c.id !== id));
  }

  const inputStyle = { width: "100%", backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-dark)", borderRadius: "7px", padding: "8px 10px", fontSize: "13px", color: "var(--text-primary)", outline: "none" };

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>Criativos & Copies</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Banco de criativos e ofertas que funcionaram</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", backgroundColor: "var(--accent)", color: "#000", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
          <Plus size={14} /> Novo Criativo
        </button>
      </div>

      {loading ? (
        <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>Carregando...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "14px" }}>
          {criativos.map((c) => (
            <div key={c.id} style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
              <div style={{ padding: "14px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "3px" }}>{c.titulo}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{c.produto}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 600, backgroundColor: STATUS_BG[c.status] || "#88888822", color: STATUS_COLORS[c.status] || "#888", display: "flex", alignItems: "center", gap: "4px" }}>
                      {c.status === "vencedor" && <Star size={9} />}{c.status}
                    </span>
                    <button onClick={() => removeCriativo(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}><X size={13} /></button>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "4px", backgroundColor: "var(--bg-hover)", color: "var(--text-secondary)" }}>{c.tipo}</span>
                  <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "4px", backgroundColor: "var(--bg-hover)", color: "var(--text-secondary)" }}>{c.plataforma}</span>
                </div>
              </div>
              {c.copy && (
                <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "6px" }}>
                    <FileText size={11} color="var(--text-muted)" />
                    <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Copy</span>
                  </div>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5, display: expandedCopy === c.id ? "block" : "-webkit-box", WebkitLineClamp: expandedCopy === c.id ? undefined : 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {c.copy}
                  </p>
                  {c.copy.length > 80 && (
                    <button onClick={() => setExpandedCopy(expandedCopy === c.id ? null : c.id)} style={{ fontSize: "11px", color: "var(--accent)", background: "none", border: "none", cursor: "pointer", marginTop: "4px", padding: 0 }}>
                      {expandedCopy === c.id ? "ver menos" : "ver mais"}
                    </button>
                  )}
                </div>
              )}
              <div style={{ padding: "12px 14px", display: "flex", gap: "16px" }}>
                {[["CTR", c.ctr, "#3b82f6"], ["CPA", c.cpa, "#ef4444"], ["ROAS", c.roas, "var(--accent)"]].map(([label, value, color]) => (
                  <div key={label}>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{label}</div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: value ? color : "var(--text-muted)" }}>{value || "—"}</div>
                  </div>
                ))}
                {c.url && <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: "auto", color: "var(--text-muted)", alignSelf: "center" }}><Link size={13} /></a>}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={() => setShowModal(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-dark)", borderRadius: "12px", padding: "24px", width: "420px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>Novo Criativo</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={16} /></button>
            </div>
            {[
              { label: "Título", key: "titulo", placeholder: "Ex: Vídeo Oferta 50% OFF" },
              { label: "Produto", key: "produto", placeholder: "Ex: Produto A" },
              { label: "CTR", key: "ctr", placeholder: "Ex: 3,2%" },
              { label: "CPA", key: "cpa", placeholder: "Ex: R$ 38,00" },
              { label: "ROAS", key: "roas", placeholder: "Ex: 4x" },
              { label: "Link (opcional)", key: "url", placeholder: "https://..." },
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "5px" }}>{label}</label>
                <input type="text" placeholder={placeholder} value={form[key as keyof typeof form]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "5px" }}>Copy</label>
              <textarea placeholder="Cole aqui a copy que funcionou..." value={form.copy} onChange={(e) => setForm((f) => ({ ...f, copy: e.target.value }))} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            {[
              { label: "Tipo", key: "tipo", options: [["imagem", "Imagem"], ["video", "Vídeo"], ["carrossel", "Carrossel"]] },
              { label: "Plataforma", key: "plataforma", options: [["facebook", "Facebook Ads"], ["google", "Google Ads"], ["ambos", "Ambos"]] },
              { label: "Status", key: "status", options: [["ativo", "Ativo"], ["vencedor", "Vencedor ⭐"], ["pausado", "Pausado"]] },
            ].map(({ label, key, options }) => (
              <div key={key} style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "5px" }}>{label}</label>
                <select value={form[key as keyof typeof form]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} style={inputStyle}>
                  {options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                </select>
              </div>
            ))}
            <button onClick={addCriativo} style={{ width: "100%", marginTop: "8px", padding: "10px", backgroundColor: "var(--accent)", color: "#000", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
              Salvar Criativo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
