"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Trash2, X, Check, Pencil, NotebookPen } from "lucide-react";

type Nota = {
  id: string;
  titulo: string;
  conteudo: string;
  cor: string;
  criadaEm: string;
};

const CORES = ["#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ef4444", "#06b6d4", "#f97316", "#ec4899"];
const STORAGE_KEY = "dropdash_notas";

const inputStyle = {
  width: "100%", padding: "8px 10px",
  backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)",
  borderRadius: "6px", fontSize: "13px", color: "var(--text-primary)",
  outline: "none", boxSizing: "border-box" as const,
};

function gerarId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function fmtData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function NotasPage() {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Nota | null>(null);
  const [form, setForm] = useState({ titulo: "", conteudo: "", cor: CORES[0] });
  const tituloRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const salvas = localStorage.getItem(STORAGE_KEY);
      if (salvas) setNotas(JSON.parse(salvas));
    } catch {}
  }, []);

  function salvar(novas: Nota[]) {
    setNotas(novas);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novas));
  }

  function abrirNova() {
    setEditando(null);
    setForm({ titulo: "", conteudo: "", cor: CORES[0] });
    setModal(true);
    setTimeout(() => tituloRef.current?.focus(), 50);
  }

  function abrirEditar(nota: Nota) {
    setEditando(nota);
    setForm({ titulo: nota.titulo, conteudo: nota.conteudo, cor: nota.cor });
    setModal(true);
    setTimeout(() => tituloRef.current?.focus(), 50);
  }

  function confirmar() {
    if (!form.titulo.trim()) return;
    if (editando) {
      salvar(notas.map(n => n.id === editando.id ? { ...editando, ...form } : n));
    } else {
      salvar([{ id: gerarId(), ...form, criadaEm: new Date().toISOString() }, ...notas]);
    }
    setModal(false);
  }

  function deletar(id: string) {
    salvar(notas.filter(n => n.id !== id));
  }

  return (
    <div style={{ padding: "28px 32px", maxWidth: "1000px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>Notas</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            {notas.length} nota{notas.length !== 1 ? "s" : ""} salva{notas.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={abrirNova}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", backgroundColor: "var(--accent)", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: "#000", cursor: "pointer" }}
        >
          <Plus size={14} /> Nova Nota
        </button>
      </div>

      {notas.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
          <NotebookPen size={40} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
          <p style={{ fontSize: "14px" }}>Nenhuma nota ainda.</p>
          <p style={{ fontSize: "13px", marginTop: "6px" }}>Clique em "Nova Nota" para começar.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {notas.map(nota => (
            <div
              key={nota.id}
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderTop: `3px solid ${nota.cor}`,
                borderRadius: "10px",
                padding: "18px",
                display: "flex", flexDirection: "column", gap: "10px",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", margin: 0, lineHeight: 1.3 }}>
                  {nota.titulo}
                </h3>
                <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                  <button onClick={() => abrirEditar(nota)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "2px", display: "flex" }}>
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => deletar(nota.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "2px", display: "flex" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {nota.conteudo && (
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {nota.conteudo}
                </p>
              )}

              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "auto" }}>
                {fmtData(nota.criadaEm)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "28px", width: "100%", maxWidth: "480px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                {editando ? "Editar Nota" : "Nova Nota"}
              </h3>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>Título *</label>
                <input
                  ref={tituloRef}
                  style={inputStyle}
                  placeholder="Título da nota..."
                  value={form.titulo}
                  onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))}
                  onKeyDown={e => { if (e.key === "Enter") confirmar(); }}
                />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>Conteúdo</label>
                <textarea
                  style={{ ...inputStyle, resize: "vertical", minHeight: "120px" }}
                  placeholder="Escreva aqui..."
                  value={form.conteudo}
                  onChange={e => setForm(p => ({ ...p, conteudo: e.target.value }))}
                />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>Cor</label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {CORES.map(cor => (
                    <button
                      key={cor}
                      onClick={() => setForm(p => ({ ...p, cor }))}
                      style={{
                        width: "24px", height: "24px", borderRadius: "50%",
                        backgroundColor: cor, border: "none", cursor: "pointer",
                        outline: form.cor === cor ? `2px solid ${cor}` : "none",
                        outlineOffset: "2px",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "20px", justifyContent: "flex-end" }}>
              <button onClick={() => setModal(false)} style={{ padding: "8px 16px", borderRadius: "7px", border: "1px solid var(--border)", backgroundColor: "var(--bg-primary)", color: "var(--text-secondary)", fontSize: "13px", cursor: "pointer" }}>
                Cancelar
              </button>
              <button onClick={confirmar} disabled={!form.titulo.trim()} style={{ padding: "8px 16px", borderRadius: "7px", border: "none", backgroundColor: "var(--accent)", color: "#000", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", opacity: form.titulo.trim() ? 1 : 0.5 }}>
                <Check size={13} /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
