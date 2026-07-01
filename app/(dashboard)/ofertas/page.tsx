"use client";

import { useEffect, useState, useRef } from "react";
import { Pencil, Pause, Play, X, Check, Plus, Trash2, ChevronDown, ChevronUp, ImageIcon } from "lucide-react";

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

type Criativo = {
  id: string;
  titulo: string;
  copy: string;
  plataforma: string;
  url: string;
  observacao?: string;
};

type CriativoForm = { titulo: string; copy: string; plataforma: string; observacao: string };

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

async function comprimirImagem(file: File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
      img.onload = () => {
        const MAX = 800;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
          else { width = Math.round((width * MAX) / height); height = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.65));
      };
    };
    reader.readAsDataURL(file);
  });
}

const inputStyle = {
  width: "100%", padding: "8px 10px",
  backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)",
  borderRadius: "6px", fontSize: "13px", color: "var(--text-primary)",
  outline: "none", boxSizing: "border-box" as const,
};

const emptyForm: CriativoForm = { titulo: "", copy: "", plataforma: "Facebook", observacao: "" };

function ModalCriativo({ titulo: tituloModal, form, setForm, imagemBase64, setImagemBase64, onSalvar, onFechar, salvando }: {
  titulo: string;
  form: CriativoForm;
  setForm: React.Dispatch<React.SetStateAction<CriativoForm>>;
  imagemBase64: string;
  setImagemBase64: (s: string) => void;
  onSalvar: () => void;
  onFechar: () => void;
  salvando: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagemBase64(await comprimirImagem(file));
  }

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
      <div style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "28px", width: "100%", maxWidth: "460px", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{tituloModal}</h3>
          <button onClick={onFechar} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={16} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>Título *</label>
            <input style={inputStyle} placeholder="Ex: Criativo Gancho Dor" value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} />
          </div>
          <div>
            <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>Copy</label>
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }} placeholder="Cole aqui o texto do anúncio..." value={form.copy} onChange={e => setForm(p => ({ ...p, copy: e.target.value }))} />
          </div>
          <div>
            <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>Observação</label>
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: "60px" }} placeholder="Notas internas sobre este criativo..." value={form.observacao} onChange={e => setForm(p => ({ ...p, observacao: e.target.value }))} />
          </div>
          <div>
            <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>Plataforma</label>
            <select style={inputStyle} value={form.plataforma} onChange={e => setForm(p => ({ ...p, plataforma: e.target.value }))}>
              <option>Facebook</option>
              <option>Google Ads (FDF)</option>
              <option>Ambos</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>Imagem (PNG)</label>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg" onChange={handleUpload} style={{ display: "none" }} />
            {imagemBase64 ? (
              <div style={{ position: "relative" }}>
                <img src={imagemBase64} alt="preview" style={{ width: "100%", maxHeight: "180px", objectFit: "cover", borderRadius: "8px" }} />
                <button onClick={() => setImagemBase64("")} style={{ position: "absolute", top: "6px", right: "6px", background: "#000000bb", border: "none", borderRadius: "50%", width: "22px", height: "22px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><X size={11} /></button>
              </div>
            ) : (
              <button onClick={() => fileRef.current?.click()} style={{ width: "100%", padding: "24px", border: "2px dashed var(--border)", borderRadius: "8px", background: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <ImageIcon size={20} />
                Clique para selecionar a imagem
              </button>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", marginTop: "20px", justifyContent: "flex-end" }}>
          <button onClick={onFechar} style={{ padding: "8px 16px", borderRadius: "7px", border: "1px solid var(--border)", backgroundColor: "var(--bg-primary)", color: "var(--text-secondary)", fontSize: "13px", cursor: "pointer" }}>Cancelar</button>
          <button onClick={onSalvar} disabled={salvando || !form.titulo.trim()} style={{ padding: "8px 16px", borderRadius: "7px", border: "none", backgroundColor: "var(--accent)", color: "#000", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", opacity: salvando ? 0.7 : 1 }}>
            <Check size={13} /> {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OfertasPage() {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [editando, setEditando] = useState<Oferta | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [criativos, setCriativos] = useState<Record<string, Criativo[]>>({});
  const [loadingCriativos, setLoadingCriativos] = useState<string | null>(null);

  // Modal adicionar criativo
  const [modalOferta, setModalOferta] = useState<string | null>(null);
  const [form, setForm] = useState<CriativoForm>(emptyForm);
  const [imagemBase64, setImagemBase64] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Modal editar criativo
  const [editandoCriativo, setEditandoCriativo] = useState<{ data: Criativo; ofertaId: string } | null>(null);
  const [editForm, setEditForm] = useState<CriativoForm>(emptyForm);
  const [editImagemBase64, setEditImagemBase64] = useState("");
  const [salvandoEdit, setSalvandoEdit] = useState(false);

  useEffect(() => { fetchOfertas(); }, []);

  async function fetchOfertas() {
    const res = await fetch("/api/ofertas");
    const data = await res.json();
    setOfertas(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function fetchCriativos(ofertaId: string) {
    if (criativos[ofertaId]) return;
    setLoadingCriativos(ofertaId);
    const res = await fetch(`/api/criativos-oferta?ofertaId=${ofertaId}`);
    const data = await res.json();
    setCriativos(prev => ({ ...prev, [ofertaId]: Array.isArray(data) ? data : [] }));
    setLoadingCriativos(null);
  }

  function toggleExpandido(id: string) {
    if (expandido === id) { setExpandido(null); return; }
    setExpandido(id);
    fetchCriativos(id);
  }

  async function toggleStatus(oferta: Oferta) {
    const novoStatus = oferta.status === "ativa" ? "pausada" : "ativa";
    await fetch("/api/ofertas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: oferta.id, status: novoStatus }),
    });
    setOfertas(prev => prev.map(o => o.id === oferta.id ? { ...o, status: novoStatus } : o));
  }

  async function salvarEdicao() {
    if (!editando) return;
    await fetch("/api/ofertas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editando.id, nome: editando.nome, preco: editando.preco, plataformas: editando.plataformas, inicio: editando.inicio, link: editando.link, notas: editando.notas }),
    });
    setOfertas(prev => prev.map(o => o.id === editando.id ? editando : o));
    setEditando(null);
  }

  async function salvarCriativo() {
    if (!modalOferta || !form.titulo.trim()) return;
    setSalvando(true);
    const res = await fetch("/api/criativos-oferta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo: form.titulo, copy: form.copy, plataforma: form.plataforma, produto: modalOferta, url: imagemBase64, observacao: form.observacao }),
    });
    const novo = await res.json();
    if (!novo.error) {
      setCriativos(prev => ({ ...prev, [modalOferta]: [novo, ...(prev[modalOferta] || [])] }));
    }
    setModalOferta(null);
    setForm(emptyForm);
    setImagemBase64("");
    setSalvando(false);
  }

  function abrirEditarCriativo(c: Criativo, ofertaId: string) {
    setEditandoCriativo({ data: c, ofertaId });
    setEditForm({ titulo: c.titulo, copy: c.copy || "", plataforma: c.plataforma, observacao: c.observacao || "" });
    setEditImagemBase64(c.url || "");
  }

  async function salvarEdicaoCriativo() {
    if (!editandoCriativo || !editForm.titulo.trim()) return;
    setSalvandoEdit(true);
    const res = await fetch("/api/criativos-oferta", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editandoCriativo.data.id, ...editForm, url: editImagemBase64 }),
    });
    const atualizado = await res.json();
    if (!atualizado.error) {
      setCriativos(prev => ({
        ...prev,
        [editandoCriativo.ofertaId]: prev[editandoCriativo.ofertaId].map(c => c.id === editandoCriativo.data.id ? atualizado : c),
      }));
    }
    setEditandoCriativo(null);
    setSalvandoEdit(false);
  }

  async function deletarCriativo(ofertaId: string, id: string) {
    await fetch(`/api/criativos-oferta?id=${id}`, { method: "DELETE" });
    setCriativos(prev => ({ ...prev, [ofertaId]: prev[ofertaId].filter(c => c.id !== id) }));
  }

  return (
    <div style={{ padding: "28px 32px", maxWidth: "900px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>Ofertas</h1>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
          {ofertas.filter(o => o.status === "ativa").length} oferta(s) ativa(s)
        </p>
      </div>

      {loading ? (
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Carregando...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {ofertas.map(oferta => (
            <div key={oferta.id} style={{
              backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)",
              borderRadius: "12px", overflow: "hidden",
              borderLeft: `3px solid ${oferta.status === "ativa" ? "#22c55e" : "#6b7280"}`,
            }}>
              <div style={{ padding: "22px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                      <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{oferta.nome}</h2>
                      <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px", backgroundColor: oferta.status === "ativa" ? "#22c55e22" : "#6b728022", color: oferta.status === "ativa" ? "#22c55e" : "#9ca3af" }}>
                        {oferta.status === "ativa" ? "Ativa" : "Pausada"}
                      </span>
                    </div>
                    <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--accent)", marginBottom: "12px" }}>{fmt(oferta.preco)}</div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                      {oferta.plataformas.map(p => (
                        <span key={p} style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "20px", backgroundColor: (platformColor[p] || "#6b7280") + "22", color: platformColor[p] || "#9ca3af", fontWeight: 600 }}>{p}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Início: {fmtDate(oferta.inicio)}</div>
                  </div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <button onClick={() => setEditando({ ...oferta })} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px", borderRadius: "7px", backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)", fontSize: "12px", color: "var(--text-secondary)", cursor: "pointer" }}>
                      <Pencil size={12} /> Editar
                    </button>
                    <button onClick={() => toggleStatus(oferta)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px", borderRadius: "7px", backgroundColor: oferta.status === "ativa" ? "#ef444422" : "#22c55e22", border: `1px solid ${oferta.status === "ativa" ? "#ef4444" : "#22c55e"}`, fontSize: "12px", color: oferta.status === "ativa" ? "#ef4444" : "#22c55e", cursor: "pointer" }}>
                      {oferta.status === "ativa" ? <><Pause size={12} /> Pausar</> : <><Play size={12} /> Ativar</>}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: "1px solid var(--border)" }}>
                <button onClick={() => toggleExpandido(oferta.id)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <ImageIcon size={13} />
                    Criativos & Copies {criativos[oferta.id] ? `(${criativos[oferta.id].length})` : ""}
                  </span>
                  {expandido === oferta.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {expandido === oferta.id && (
                  <div style={{ padding: "0 24px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
                      <button onClick={() => setModalOferta(oferta.id)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "7px", backgroundColor: "var(--accent)", border: "none", fontSize: "12px", fontWeight: 600, color: "#000", cursor: "pointer" }}>
                        <Plus size={12} /> Adicionar Criativo
                      </button>
                    </div>

                    {loadingCriativos === oferta.id ? (
                      <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Carregando...</p>
                    ) : (criativos[oferta.id] || []).length === 0 ? (
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", padding: "20px 0" }}>Nenhum criativo ainda. Clique em "Adicionar Criativo".</p>
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
                        {(criativos[oferta.id] || []).map(c => (
                          <div key={c.id} style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
                            {c.url ? (
                              <img src={c.url} alt={c.titulo} style={{ width: "100%", height: "140px", objectFit: "cover", display: "block" }} />
                            ) : (
                              <div style={{ width: "100%", height: "140px", backgroundColor: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <ImageIcon size={24} color="var(--text-muted)" />
                              </div>
                            )}
                            <div style={{ padding: "10px" }}>
                              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>{c.titulo}</div>
                              {c.copy && <p style={{ fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: "4px" }}>{c.copy}</p>}
                              {c.observacao && <p style={{ fontSize: "10px", color: "var(--text-muted)", fontStyle: "italic", lineHeight: 1.3, marginBottom: "6px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.observacao}</p>}
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                                <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", backgroundColor: (platformColor[c.plataforma] || "#6b7280") + "22", color: platformColor[c.plataforma] || "#9ca3af" }}>{c.plataforma}</span>
                                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                  <button onClick={() => abrirEditarCriativo(c, oferta.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0, display: "flex" }} title="Editar">
                                    <Pencil size={12} />
                                  </button>
                                  <button onClick={() => deletarCriativo(oferta.id, c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: 0, display: "flex" }} title="Excluir">
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal editar oferta */}
      {editando && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "28px", width: "100%", maxWidth: "460px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Editar Oferta</h3>
              <button onClick={() => setEditando(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={16} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[["Nome", "nome"], ["Preço (R$)", "preco"], ["Plataformas (vírgula)", "plataformas"], ["Data de Início", "inicio"], ["Link da Página", "link"]].map(([label, key]) => (
                <div key={key}>
                  <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>{label}</label>
                  <input style={inputStyle} type={key === "preco" ? "number" : key === "inicio" ? "date" : "text"} value={key === "plataformas" ? (editando as any)[key]?.join(", ") : (editando as any)[key] || ""}
                    onChange={e => setEditando(prev => ({ ...prev!, [key]: key === "plataformas" ? e.target.value.split(",").map(p => p.trim()) : key === "preco" ? parseFloat(e.target.value) : e.target.value }))} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>Notas</label>
                <textarea style={{ ...inputStyle, resize: "vertical", minHeight: "60px" }} value={editando.notas || ""} onChange={e => setEditando(prev => ({ ...prev!, notas: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "20px", justifyContent: "flex-end" }}>
              <button onClick={() => setEditando(null)} style={{ padding: "8px 16px", borderRadius: "7px", border: "1px solid var(--border)", backgroundColor: "var(--bg-primary)", color: "var(--text-secondary)", fontSize: "13px", cursor: "pointer" }}>Cancelar</button>
              <button onClick={salvarEdicao} style={{ padding: "8px 16px", borderRadius: "7px", border: "none", backgroundColor: "var(--accent)", color: "#000", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                <Check size={13} /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal adicionar criativo */}
      {modalOferta && (
        <ModalCriativo
          titulo="Adicionar Criativo"
          form={form}
          setForm={setForm}
          imagemBase64={imagemBase64}
          setImagemBase64={setImagemBase64}
          onSalvar={salvarCriativo}
          onFechar={() => { setModalOferta(null); setForm(emptyForm); setImagemBase64(""); }}
          salvando={salvando}
        />
      )}

      {/* Modal editar criativo */}
      {editandoCriativo && (
        <ModalCriativo
          titulo="Editar Criativo"
          form={editForm}
          setForm={setEditForm}
          imagemBase64={editImagemBase64}
          setImagemBase64={setEditImagemBase64}
          onSalvar={salvarEdicaoCriativo}
          onFechar={() => setEditandoCriativo(null)}
          salvando={salvandoEdit}
        />
      )}
    </div>
  );
}
