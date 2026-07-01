"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Trash2, X, Check, Pencil, NotebookPen, FolderOpen, Folder, FolderPlus } from "lucide-react";

type Pasta = { id: string; nome: string; };
type Nota = { id: string; titulo: string; conteudo: string; cor: string; criadaEm: string; pastaId: string | null; };

const PASTAS_KEY = "dropdash_pastas";
const NOTAS_KEY = "dropdash_notas";

const PASTAS_PADRAO: Pasta[] = [
  { id: "conteudos", nome: "Conteúdos" },
  { id: "inspiracoes", nome: "Inspirações" },
  { id: "concorrentes", nome: "Concorrentes" },
];

const CORES = ["#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ef4444", "#06b6d4", "#f97316", "#ec4899"];

const inputStyle = {
  width: "100%", padding: "8px 10px",
  backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)",
  borderRadius: "6px", fontSize: "13px", color: "var(--text-primary)",
  outline: "none", boxSizing: "border-box" as const,
};

function gerarId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }
function fmtData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default function NotasPage() {
  const [pastas, setPastas] = useState<Pasta[]>([]);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [pastaAtiva, setPastaAtiva] = useState<string | null>(null); // null = Todas
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Nota | null>(null);
  const [form, setForm] = useState({ titulo: "", conteudo: "", cor: CORES[0], pastaId: null as string | null });
  const [novaPasta, setNovaPasta] = useState(false);
  const [nomePasta, setNomePasta] = useState("");
  const tituloRef = useRef<HTMLInputElement>(null);
  const pastaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const p = localStorage.getItem(PASTAS_KEY);
      const n = localStorage.getItem(NOTAS_KEY);
      setPastas(p ? JSON.parse(p) : PASTAS_PADRAO);
      setNotas(n ? JSON.parse(n) : []);
      if (!p) localStorage.setItem(PASTAS_KEY, JSON.stringify(PASTAS_PADRAO));
    } catch {}
  }, []);

  function salvarPastas(novas: Pasta[]) {
    setPastas(novas);
    localStorage.setItem(PASTAS_KEY, JSON.stringify(novas));
  }
  function salvarNotas(novas: Nota[]) {
    setNotas(novas);
    localStorage.setItem(NOTAS_KEY, JSON.stringify(novas));
  }

  function adicionarPasta() {
    if (!nomePasta.trim()) return;
    const nova = { id: gerarId(), nome: nomePasta.trim() };
    salvarPastas([...pastas, nova]);
    setNomePasta("");
    setNovaPasta(false);
  }

  function deletarPasta(id: string) {
    salvarPastas(pastas.filter(p => p.id !== id));
    salvarNotas(notas.map(n => n.pastaId === id ? { ...n, pastaId: null } : n));
    if (pastaAtiva === id) setPastaAtiva(null);
  }

  function abrirNova() {
    setEditando(null);
    setForm({ titulo: "", conteudo: "", cor: CORES[0], pastaId: pastaAtiva });
    setModal(true);
    setTimeout(() => tituloRef.current?.focus(), 50);
  }

  function abrirEditar(nota: Nota) {
    setEditando(nota);
    setForm({ titulo: nota.titulo, conteudo: nota.conteudo, cor: nota.cor, pastaId: nota.pastaId });
    setModal(true);
    setTimeout(() => tituloRef.current?.focus(), 50);
  }

  function confirmar() {
    if (!form.titulo.trim()) return;
    if (editando) {
      salvarNotas(notas.map(n => n.id === editando.id ? { ...editando, ...form } : n));
    } else {
      salvarNotas([{ id: gerarId(), ...form, criadaEm: new Date().toISOString() }, ...notas]);
    }
    setModal(false);
  }

  function deletarNota(id: string) {
    salvarNotas(notas.filter(n => n.id !== id));
  }

  const notasFiltradas = pastaAtiva === null
    ? notas
    : notas.filter(n => n.pastaId === pastaAtiva);

  return (
    <div style={{ display: "flex", height: "calc(100vh - 0px)", overflow: "hidden" }}>

      {/* Sidebar de pastas */}
      <div style={{
        width: "180px", minWidth: "180px",
        borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        padding: "20px 0",
        backgroundColor: "var(--sidebar-bg)",
      }}>
        <div style={{ padding: "0 12px", marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Pastas</span>
          <button onClick={() => { setNovaPasta(true); setTimeout(() => pastaInputRef.current?.focus(), 50); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: 0 }}>
            <FolderPlus size={14} />
          </button>
        </div>

        {/* Todas as notas */}
        <button
          onClick={() => setPastaAtiva(null)}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "8px 12px", background: "none", border: "none",
            cursor: "pointer", textAlign: "left",
            fontSize: "13px",
            color: pastaAtiva === null ? "var(--accent)" : "var(--text-secondary)",
            backgroundColor: pastaAtiva === null ? "var(--sidebar-active)" : "transparent",
            borderRadius: "6px", margin: "0 4px", width: "calc(100% - 8px)",
          }}
        >
          <NotebookPen size={13} />
          Todas ({notas.length})
        </button>

        {/* Lista de pastas */}
        <div style={{ marginTop: "4px" }}>
          {pastas.map(pasta => (
            <div key={pasta.id} style={{ display: "flex", alignItems: "center", margin: "0 4px", borderRadius: "6px", backgroundColor: pastaAtiva === pasta.id ? "var(--sidebar-active)" : "transparent" }}>
              <button
                onClick={() => setPastaAtiva(pasta.id)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "8px 10px", background: "none", border: "none",
                  cursor: "pointer", flex: 1, textAlign: "left",
                  fontSize: "13px",
                  color: pastaAtiva === pasta.id ? "var(--accent)" : "var(--text-secondary)",
                }}
              >
                {pastaAtiva === pasta.id ? <FolderOpen size={13} /> : <Folder size={13} />}
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pasta.nome}</span>
              </button>
              {!PASTAS_PADRAO.find(p => p.id === pasta.id) && (
                <button onClick={() => deletarPasta(pasta.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "4px 6px 4px 0", display: "flex", opacity: 0.5 }}>
                  <X size={11} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Input nova pasta */}
        {novaPasta && (
          <div style={{ padding: "6px 8px", marginTop: "4px" }}>
            <input
              ref={pastaInputRef}
              style={{ ...inputStyle, fontSize: "12px", padding: "6px 8px" }}
              placeholder="Nome da pasta..."
              value={nomePasta}
              onChange={e => setNomePasta(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") adicionarPasta();
                if (e.key === "Escape") { setNovaPasta(false); setNomePasta(""); }
              }}
              onBlur={() => { if (!nomePasta.trim()) { setNovaPasta(false); } }}
            />
          </div>
        )}
      </div>

      {/* Área principal */}
      <div style={{ flex: 1, overflow: "auto", padding: "28px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
              {pastaAtiva === null ? "Todas as Notas" : pastas.find(p => p.id === pastaAtiva)?.nome ?? "Notas"}
            </h1>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "3px" }}>
              {notasFiltradas.length} nota{notasFiltradas.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={abrirNova}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", backgroundColor: "var(--accent)", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, color: "#000", cursor: "pointer" }}
          >
            <Plus size={14} /> Nova Nota
          </button>
        </div>

        {notasFiltradas.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
            <NotebookPen size={36} style={{ margin: "0 auto 12px", opacity: 0.25, display: "block" }} />
            <p style={{ fontSize: "13px" }}>Nenhuma nota aqui ainda.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px" }}>
            {notasFiltradas.map(nota => (
              <div key={nota.id} style={{
                backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)",
                borderTop: `3px solid ${nota.cor}`, borderRadius: "10px", padding: "16px",
                display: "flex", flexDirection: "column", gap: "8px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                  <h3 style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", margin: 0, lineHeight: 1.3 }}>{nota.titulo}</h3>
                  <div style={{ display: "flex", gap: "2px", flexShrink: 0 }}>
                    <button onClick={() => abrirEditar(nota)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "2px", display: "flex" }}><Pencil size={12} /></button>
                    <button onClick={() => deletarNota(nota.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "2px", display: "flex" }}><Trash2 size={12} /></button>
                  </div>
                </div>
                {nota.conteudo && (
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {nota.conteudo}
                  </p>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{fmtData(nota.criadaEm)}</span>
                  {nota.pastaId && pastaAtiva === null && (
                    <span style={{ fontSize: "10px", color: "var(--text-muted)", backgroundColor: "var(--bg-primary)", padding: "2px 6px", borderRadius: "4px" }}>
                      {pastas.find(p => p.id === nota.pastaId)?.nome}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal nota */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "28px", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                {editando ? "Editar Nota" : "Nova Nota"}
              </h3>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={16} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>Título *</label>
                <input ref={tituloRef} style={inputStyle} placeholder="Título da nota..." value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} onKeyDown={e => { if (e.key === "Enter") confirmar(); }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>Conteúdo</label>
                <textarea style={{ ...inputStyle, resize: "vertical", minHeight: "140px" }} placeholder="Escreva aqui..." value={form.conteudo} onChange={e => setForm(p => ({ ...p, conteudo: e.target.value }))} />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>Pasta</label>
                <select style={inputStyle} value={form.pastaId ?? ""} onChange={e => setForm(p => ({ ...p, pastaId: e.target.value || null }))}>
                  <option value="">Sem pasta</option>
                  {pastas.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>Cor</label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {CORES.map(cor => (
                    <button key={cor} onClick={() => setForm(p => ({ ...p, cor }))} style={{ width: "22px", height: "22px", borderRadius: "50%", backgroundColor: cor, border: "none", cursor: "pointer", outline: form.cor === cor ? `2px solid ${cor}` : "none", outlineOffset: "2px" }} />
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "20px", justifyContent: "flex-end" }}>
              <button onClick={() => setModal(false)} style={{ padding: "8px 16px", borderRadius: "7px", border: "1px solid var(--border)", backgroundColor: "var(--bg-primary)", color: "var(--text-secondary)", fontSize: "13px", cursor: "pointer" }}>Cancelar</button>
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
