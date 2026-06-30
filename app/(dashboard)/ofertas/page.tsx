"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Facebook, BarChart2, Pencil, Pause, Play, X, Check } from "lucide-react";

type Oferta = {
  id: string;
  nome: string;
  preco: number;
  plataformas: string[];
  inicio: string;
  status: "ativa" | "pausada";
  link?: string;
  notas?: string;
};

const platformColor: Record<string, string> = {
  "Facebook": "#1877f2",
  "Google Ads (FDF)": "#ea4335",
};

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtDate(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export default function OfertasPage() {
  const supabase = createClient();
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [editando, setEditando] = useState<Oferta | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchOfertas() {
    const { data } = await supabase.from("ofertas").select("*").order("created_at");
    setOfertas((data as Oferta[]) || []);
    setLoading(false);
  }

  useEffect(() => { fetchOfertas(); }, []);

  async function toggleStatus(oferta: Oferta) {
    const novoStatus = oferta.status === "ativa" ? "pausada" : "ativa";
    await supabase.from("ofertas").update({ status: novoStatus }).eq("id", oferta.id);
    setOfertas(prev => prev.map(o => o.id === oferta.id ? { ...o, status: novoStatus } : o));
  }

  async function salvarEdicao() {
    if (!editando) return;
    await supabase.from("ofertas").update({
      nome: editando.nome,
      preco: editando.preco,
      plataformas: editando.plataformas,
      inicio: editando.inicio,
      link: editando.link,
      notas: editando.notas,
    }).eq("id", editando.id);
    setOfertas(prev => prev.map(o => o.id === editando.id ? editando : o));
    setEditando(null);
  }

  const inputStyle = {
    width: "100%", padding: "8px 10px",
    backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)",
    borderRadius: "6px", fontSize: "13px", color: "var(--text-primary)",
    outline: "none", boxSizing: "border-box" as const,
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: "900px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>Ofertas</h1>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
          {ofertas.filter(o => o.status === "ativa").length} oferta{ofertas.filter(o => o.status === "ativa").length !== 1 ? "s" : ""} ativa{ofertas.filter(o => o.status === "ativa").length !== 1 ? "s" : ""}
        </p>
      </div>

      {loading ? (
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Carregando...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {ofertas.map(oferta => (
            <div key={oferta.id} style={{
              backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)",
              borderRadius: "12px", padding: "22px 24px",
              borderLeft: `3px solid ${oferta.status === "ativa" ? "#22c55e" : "#6b7280"}`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                      {oferta.nome}
                    </h2>
                    <span style={{
                      fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px",
                      backgroundColor: oferta.status === "ativa" ? "#22c55e22" : "#6b728022",
                      color: oferta.status === "ativa" ? "#22c55e" : "#9ca3af",
                    }}>
                      {oferta.status === "ativa" ? "Ativa" : "Pausada"}
                    </span>
                  </div>

                  <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--accent)", marginBottom: "12px" }}>
                    {fmt(oferta.preco)}
                  </div>

                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                    {oferta.plataformas.map(p => (
                      <span key={p} style={{
                        fontSize: "11px", padding: "3px 10px", borderRadius: "20px",
                        backgroundColor: (platformColor[p] || "#6b7280") + "22",
                        color: platformColor[p] || "#9ca3af",
                        fontWeight: 600,
                      }}>
                        {p}
                      </span>
                    ))}
                  </div>

                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Início: {fmtDate(oferta.inicio)}
                  </div>

                  {oferta.notas && (
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "8px", fontStyle: "italic" }}>
                      {oferta.notas}
                    </div>
                  )}
                </div>

                {/* Ações */}
                <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <button
                    onClick={() => setEditando({ ...oferta })}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "7px 12px", borderRadius: "7px",
                      backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)",
                      fontSize: "12px", color: "var(--text-secondary)", cursor: "pointer",
                    }}
                  >
                    <Pencil size={12} /> Editar
                  </button>
                  <button
                    onClick={() => toggleStatus(oferta)}
                    style={{
                      display: "flex", alignItems: "center", gap: "6px",
                      padding: "7px 12px", borderRadius: "7px",
                      backgroundColor: oferta.status === "ativa" ? "#ef444422" : "#22c55e22",
                      border: `1px solid ${oferta.status === "ativa" ? "#ef4444" : "#22c55e"}`,
                      fontSize: "12px",
                      color: oferta.status === "ativa" ? "#ef4444" : "#22c55e",
                      cursor: "pointer",
                    }}
                  >
                    {oferta.status === "ativa" ? <><Pause size={12} /> Pausar</> : <><Play size={12} /> Ativar</>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de edição */}
      {editando && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "#00000088",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
        }}>
          <div style={{
            backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)",
            borderRadius: "12px", padding: "28px", width: "100%", maxWidth: "460px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Editar Oferta</h3>
              <button onClick={() => setEditando(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>Nome</label>
                <input style={inputStyle} value={editando.nome} onChange={e => setEditando({ ...editando, nome: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>Preço (R$)</label>
                <input style={inputStyle} type="number" value={editando.preco} onChange={e => setEditando({ ...editando, preco: parseFloat(e.target.value) })} />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>Plataformas (separadas por vírgula)</label>
                <input style={inputStyle} value={editando.plataformas.join(", ")} onChange={e => setEditando({ ...editando, plataformas: e.target.value.split(",").map(p => p.trim()) })} />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>Data de Início</label>
                <input style={inputStyle} type="date" value={editando.inicio} onChange={e => setEditando({ ...editando, inicio: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>Link da Página (opcional)</label>
                <input style={inputStyle} value={editando.link || ""} onChange={e => setEditando({ ...editando, link: e.target.value })} placeholder="https://..." />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>Notas (opcional)</label>
                <textarea style={{ ...inputStyle, resize: "vertical", minHeight: "60px" }} value={editando.notas || ""} onChange={e => setEditando({ ...editando, notas: e.target.value })} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "20px", justifyContent: "flex-end" }}>
              <button onClick={() => setEditando(null)} style={{ padding: "8px 16px", borderRadius: "7px", border: "1px solid var(--border)", backgroundColor: "var(--bg-primary)", color: "var(--text-secondary)", fontSize: "13px", cursor: "pointer" }}>
                Cancelar
              </button>
              <button onClick={salvarEdicao} style={{ padding: "8px 16px", borderRadius: "7px", border: "none", backgroundColor: "var(--accent)", color: "#000", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                <Check size={13} /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
