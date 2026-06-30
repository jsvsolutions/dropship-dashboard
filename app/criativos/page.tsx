"use client";

import { useState } from "react";
import { Plus, X, Star, Link, FileText } from "lucide-react";

type Criativo = {
  id: string;
  titulo: string;
  produto: string;
  tipo: "imagem" | "video" | "carrossel";
  plataforma: "facebook" | "google" | "ambos";
  copy: string;
  ctr: string;
  cpa: string;
  roas: string;
  status: "vencedor" | "ativo" | "pausado";
  url: string;
};

const STATUS_COLORS = {
  vencedor: "#f59e0b",
  ativo: "#22c55e",
  pausado: "#555570",
};

const STATUS_BG = {
  vencedor: "#f59e0b22",
  ativo: "#22c55e22",
  pausado: "#55557022",
};

const INITIAL: Criativo[] = [
  {
    id: "1",
    titulo: "Criativo Vídeo — Oferta 50%",
    produto: "Produto Exemplo A",
    tipo: "video",
    plataforma: "facebook",
    copy: "Descubra o produto que está mudando a vida de milhares de pessoas! Aproveite 50% OFF por tempo limitado.",
    ctr: "3,2%",
    cpa: "R$ 38,00",
    roas: "4,2x",
    status: "vencedor",
    url: "",
  },
];

export default function CriativosPage() {
  const [criativos, setCriativos] = useState<Criativo[]>(INITIAL);
  const [showModal, setShowModal] = useState(false);
  const [expandedCopy, setExpandedCopy] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Criativo, "id">>({
    titulo: "",
    produto: "",
    tipo: "imagem",
    plataforma: "facebook",
    copy: "",
    ctr: "",
    cpa: "",
    roas: "",
    status: "ativo",
    url: "",
  });

  function addCriativo() {
    if (!form.titulo.trim()) return;
    setCriativos((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    setShowModal(false);
    setForm({ titulo: "", produto: "", tipo: "imagem", plataforma: "facebook", copy: "", ctr: "", cpa: "", roas: "", status: "ativo", url: "" });
  }

  return (
    <div style={{ padding: "28px 32px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#f0f0f5" }}>
            Criativos & Copies
          </h1>
          <p style={{ fontSize: "13px", color: "#555570", marginTop: "4px" }}>
            Banco de criativos e ofertas que funcionaram
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "8px 14px", backgroundColor: "#22c55e", color: "#000",
            border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: 600, cursor: "pointer",
          }}
        >
          <Plus size={14} />
          Novo Criativo
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "14px" }}>
        {criativos.map((c) => (
          <div
            key={c.id}
            style={{
              backgroundColor: "#111118", border: "1px solid #1e1e2e",
              borderRadius: "10px", overflow: "hidden",
            }}
          >
            {/* Card top */}
            <div style={{ padding: "14px", borderBottom: "1px solid #1e1e2e" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#f0f0f5", marginBottom: "3px" }}>
                    {c.titulo}
                  </div>
                  <div style={{ fontSize: "11px", color: "#555570" }}>{c.produto}</div>
                </div>
                <span style={{
                  padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 600,
                  backgroundColor: STATUS_BG[c.status], color: STATUS_COLORS[c.status],
                  display: "flex", alignItems: "center", gap: "4px", whiteSpace: "nowrap",
                }}>
                  {c.status === "vencedor" && <Star size={9} />}
                  {c.status}
                </span>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "4px", backgroundColor: "#1e1e2e", color: "#8888aa" }}>
                  {c.tipo}
                </span>
                <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "4px", backgroundColor: "#1e1e2e", color: "#8888aa" }}>
                  {c.plataforma}
                </span>
              </div>
            </div>

            {/* Copy */}
            <div style={{ padding: "12px 14px", borderBottom: "1px solid #1e1e2e" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "6px" }}>
                <FileText size={11} color="#555570" />
                <span style={{ fontSize: "10px", color: "#555570", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Copy
                </span>
              </div>
              <p style={{
                fontSize: "12px", color: "#8888aa", lineHeight: 1.5,
                display: expandedCopy === c.id ? "block" : "-webkit-box",
                WebkitLineClamp: expandedCopy === c.id ? undefined : 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>
                {c.copy}
              </p>
              {c.copy.length > 80 && (
                <button
                  onClick={() => setExpandedCopy(expandedCopy === c.id ? null : c.id)}
                  style={{ fontSize: "11px", color: "#22c55e", background: "none", border: "none", cursor: "pointer", marginTop: "4px", padding: 0 }}
                >
                  {expandedCopy === c.id ? "ver menos" : "ver mais"}
                </button>
              )}
            </div>

            {/* Metrics */}
            <div style={{ padding: "12px 14px", display: "flex", gap: "16px" }}>
              {[
                { label: "CTR", value: c.ctr, color: "#3b82f6" },
                { label: "CPA", value: c.cpa, color: "#ef4444" },
                { label: "ROAS", value: c.roas, color: "#22c55e" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div style={{ fontSize: "10px", color: "#555570" }}>{label}</div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: value ? color : "#555570" }}>
                    {value || "—"}
                  </div>
                </div>
              ))}
              {c.url && (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: "auto", color: "#555570", alignSelf: "center" }}
                >
                  <Link size={13} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: "#16161e", border: "1px solid #2a2a3a", borderRadius: "12px", padding: "24px", width: "420px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#f0f0f5" }}>Novo Criativo</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "#555570", cursor: "pointer" }}>
                <X size={16} />
              </button>
            </div>

            {[
              { label: "Título do Criativo", key: "titulo", placeholder: "Ex: Vídeo Oferta 50% OFF" },
              { label: "Produto", key: "produto", placeholder: "Ex: Produto A" },
              { label: "CTR", key: "ctr", placeholder: "Ex: 3,2%" },
              { label: "CPA", key: "cpa", placeholder: "Ex: R$ 38,00" },
              { label: "ROAS", key: "roas", placeholder: "Ex: 4x" },
              { label: "Link do criativo (opcional)", key: "url", placeholder: "https://..." },
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", color: "#8888aa", display: "block", marginBottom: "5px" }}>{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  style={{ width: "100%", backgroundColor: "#0d0d15", border: "1px solid #2a2a3a", borderRadius: "7px", padding: "8px 10px", fontSize: "13px", color: "#f0f0f5", outline: "none" }}
                />
              </div>
            ))}

            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "12px", color: "#8888aa", display: "block", marginBottom: "5px" }}>Copy da Oferta</label>
              <textarea
                placeholder="Cole aqui a copy que funcionou..."
                value={form.copy}
                onChange={(e) => setForm((f) => ({ ...f, copy: e.target.value }))}
                rows={4}
                style={{ width: "100%", backgroundColor: "#0d0d15", border: "1px solid #2a2a3a", borderRadius: "7px", padding: "8px 10px", fontSize: "13px", color: "#f0f0f5", outline: "none", resize: "vertical" }}
              />
            </div>

            {[
              { label: "Tipo", key: "tipo", options: [["imagem", "Imagem"], ["video", "Vídeo"], ["carrossel", "Carrossel"]] },
              { label: "Plataforma", key: "plataforma", options: [["facebook", "Facebook Ads"], ["google", "Google Ads"], ["ambos", "Ambos"]] },
              { label: "Status", key: "status", options: [["ativo", "Ativo"], ["vencedor", "Vencedor ⭐"], ["pausado", "Pausado"]] },
            ].map(({ label, key, options }) => (
              <div key={key} style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", color: "#8888aa", display: "block", marginBottom: "5px" }}>{label}</label>
                <select
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  style={{ width: "100%", backgroundColor: "#0d0d15", border: "1px solid #2a2a3a", borderRadius: "7px", padding: "8px 10px", fontSize: "13px", color: "#f0f0f5", outline: "none" }}
                >
                  {options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                </select>
              </div>
            ))}

            <button
              onClick={addCriativo}
              style={{ width: "100%", marginTop: "8px", padding: "10px", backgroundColor: "#22c55e", color: "#000", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
            >
              Salvar Criativo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
