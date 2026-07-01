"use client";

import { useEffect, useState, useCallback } from "react";
import { ScanSearch, Plus, X, RefreshCw, Wifi, WifiOff, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const TOKEN_KEY = "meta_access_token";
const COMPETITORS_KEY = "mineracao_competitors";
const OAUTH_URL = "https://www.facebook.com/dialog/oauth?client_id=2456405581524706&redirect_uri=https://www.facebook.com/connect/login_success.html&response_type=token&scope=public_profile";

type Competitor = {
  id: string;
  pageId: string;
  nome: string;
};

type Ad = {
  id: string;
  ad_creation_time?: string;
  ad_delivery_start_time?: string;
  ad_delivery_stop_time?: string;
  ad_creative_bodies?: string[];
  ad_creative_link_titles?: string[];
  publisher_platforms?: string[];
  page_name?: string;
};

function buildTimeSeries(ads: Ad[], days = 30) {
  const today = new Date();
  return Array.from({ length: days + 1 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - i));
    const dateStr = d.toISOString().slice(0, 10);
    const label = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
    const ativos = ads.filter(ad => {
      const start = (ad.ad_delivery_start_time || ad.ad_creation_time || "").slice(0, 10);
      const stop = ad.ad_delivery_stop_time?.slice(0, 10);
      return start && start <= dateStr && (!stop || stop >= dateStr);
    }).length;
    return { date: label, ativos };
  });
}

const inputStyle = {
  width: "100%", padding: "8px 10px",
  backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)",
  borderRadius: "6px", fontSize: "13px", color: "var(--text-primary)",
  outline: "none", boxSizing: "border-box" as const,
};

export default function MineracaoPage() {
  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [addForm, setAddForm] = useState({ nome: "", pageUrl: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [adicionando, setAdicionando] = useState(false);
  const [adsData, setAdsData] = useState<Record<string, { ads: Ad[]; loading: boolean; error?: string; expanded: boolean }>>({});

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY) || "";
    const c = JSON.parse(localStorage.getItem(COMPETITORS_KEY) || "[]");
    setToken(t);
    setCompetitors(c);
  }, []);

  function salvarToken() {
    localStorage.setItem(TOKEN_KEY, tokenInput.trim());
    setToken(tokenInput.trim());
    setTokenInput("");
  }

  function desconectar() {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
  }

  function salvarCompetitors(list: Competitor[]) {
    setCompetitors(list);
    localStorage.setItem(COMPETITORS_KEY, JSON.stringify(list));
  }

  async function adicionarConcorrente() {
    if (!addForm.nome.trim() || !addForm.pageUrl.trim()) return;
    setAdicionando(true);

    let slug = addForm.pageUrl.trim();
    // extrair slug de URL do Facebook
    const match = slug.match(/facebook\.com\/([^/?&]+)/);
    if (match) slug = match[1];

    // resolver slug → page ID via API
    let pageId = slug;
    if (isNaN(Number(slug))) {
      const res = await fetch(`/api/mineracao?resolveSlug=${slug}&token=${token}`);
      const data = await res.json();
      if (data.id) {
        pageId = data.id;
      }
    }

    const novo: Competitor = {
      id: crypto.randomUUID(),
      pageId,
      nome: addForm.nome.trim(),
    };
    salvarCompetitors([...competitors, novo]);
    setAddForm({ nome: "", pageUrl: "" });
    setShowAdd(false);
    setAdicionando(false);
  }

  function removerConcorrente(id: string) {
    salvarCompetitors(competitors.filter(c => c.id !== id));
    setAdsData(prev => { const n = { ...prev }; delete n[id]; return n; });
  }

  async function fetchAds(c: Competitor) {
    setAdsData(prev => ({ ...prev, [c.id]: { ads: [], loading: true, expanded: prev[c.id]?.expanded ?? true } }));
    const res = await fetch(`/api/mineracao?pageId=${c.pageId}&token=${token}`);
    const data = await res.json();
    if (data.error) {
      setAdsData(prev => ({ ...prev, [c.id]: { ads: [], loading: false, error: data.error, expanded: true } }));
    } else {
      setAdsData(prev => ({ ...prev, [c.id]: { ads: data.ads, loading: false, expanded: true } }));
    }
  }

  function toggleExpand(id: string) {
    setAdsData(prev => ({ ...prev, [id]: { ...prev[id], expanded: !prev[id]?.expanded } }));
  }

  const ativosAgora = (ads: Ad[]) => {
    const hoje = new Date().toISOString().slice(0, 10);
    return ads.filter(ad => {
      const start = (ad.ad_delivery_start_time || ad.ad_creation_time || "").slice(0, 10);
      const stop = ad.ad_delivery_stop_time?.slice(0, 10);
      return start && start <= hoje && (!stop || stop >= hoje);
    }).length;
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: "1200px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>Mineração</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            Monitoramento de anúncios de concorrentes na UE via Meta Ad Library
          </p>
        </div>
        {token && (
          <button onClick={() => setShowAdd(!showAdd)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", backgroundColor: "var(--accent)", color: "#000", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
            <Plus size={14} /> Adicionar Concorrente
          </button>
        )}
      </div>

      {/* Banner de conexão */}
      {!token ? (
        <div style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", padding: "32px", textAlign: "center", marginBottom: "24px" }}>
          <WifiOff size={32} color="var(--text-muted)" style={{ marginBottom: "12px" }} />
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>Conecte sua conta Meta</h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px", maxWidth: "400px", margin: "0 auto 20px" }}>
            Quando o app Meta estiver ativo, abra o link abaixo, autorize e cole o token aqui.
          </p>
          <a href={OAUTH_URL} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", backgroundColor: "#1877f2", color: "#fff", borderRadius: "7px", fontSize: "13px", fontWeight: 600, textDecoration: "none", marginBottom: "20px" }}>
            Conectar com Facebook
          </a>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "12px" }}>
            Após autorizar, copie o token da URL e cole aqui:
          </p>
          <div style={{ display: "flex", gap: "8px", maxWidth: "500px", margin: "0 auto" }}>
            <input style={{ ...inputStyle, flex: 1 }} placeholder="Cole o access_token aqui..." value={tokenInput} onChange={e => setTokenInput(e.target.value)} />
            <button onClick={salvarToken} disabled={!tokenInput.trim()} style={{ padding: "8px 16px", backgroundColor: "var(--accent)", color: "#000", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
              Salvar
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", backgroundColor: "#22c55e11", border: "1px solid #22c55e44", borderRadius: "8px", marginBottom: "20px" }}>
          <Wifi size={14} color="#22c55e" />
          <span style={{ fontSize: "12px", color: "#22c55e", fontWeight: 600 }}>Meta conectado</span>
          <button onClick={desconectar} style={{ marginLeft: "auto", fontSize: "11px", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>Desconectar</button>
        </div>
      )}

      {/* Form adicionar concorrente */}
      {showAdd && token && (
        <div style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "14px" }}>Novo Concorrente</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>Nome</label>
              <input style={inputStyle} placeholder="Ex: Concorrente A" value={addForm.nome} onChange={e => setAddForm(p => ({ ...p, nome: e.target.value }))} />
            </div>
            <div style={{ flex: 2, minWidth: "280px" }}>
              <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px" }}>URL ou ID da Página do Facebook</label>
              <input style={inputStyle} placeholder="https://www.facebook.com/nomeda pagina ou ID numérico" value={addForm.pageUrl} onChange={e => setAddForm(p => ({ ...p, pageUrl: e.target.value }))} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
              <button onClick={adicionarConcorrente} disabled={adicionando || !addForm.nome || !addForm.pageUrl} style={{ padding: "8px 16px", backgroundColor: "var(--accent)", color: "#000", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                {adicionando ? "Adicionando..." : "Adicionar"}
              </button>
              <button onClick={() => setShowAdd(false)} style={{ padding: "8px", backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: "7px", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de concorrentes */}
      {competitors.length === 0 && token && (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", fontSize: "13px" }}>
          Nenhum concorrente adicionado. Clique em "Adicionar Concorrente".
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {competitors.map(c => {
          const d = adsData[c.id];
          const series = d?.ads ? buildTimeSeries(d.ads, 30) : [];
          const ativos = d?.ads ? ativosAgora(d.ads) : null;

          return (
            <div key={c.id} style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
              {/* Header do card */}
              <div style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{c.nome}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>Page ID: {c.pageId}</div>
                </div>

                {ativos !== null && (
                  <div style={{ textAlign: "center", padding: "8px 16px", backgroundColor: "#22c55e22", borderRadius: "8px" }}>
                    <div style={{ fontSize: "22px", fontWeight: 700, color: "#22c55e" }}>{ativos}</div>
                    <div style={{ fontSize: "10px", color: "#22c55e" }}>ativos agora</div>
                  </div>
                )}

                <div style={{ display: "flex", gap: "8px" }}>
                  {!d || (!d.loading && !d.ads?.length) ? (
                    <button onClick={() => fetchAds(c)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px", backgroundColor: "var(--accent)", border: "none", borderRadius: "7px", fontSize: "12px", fontWeight: 600, color: "#000", cursor: "pointer" }}>
                      <Eye size={12} /> Monitorar
                    </button>
                  ) : (
                    <button onClick={() => fetchAds(c)} disabled={d.loading} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px", backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: "7px", fontSize: "12px", color: "var(--text-secondary)", cursor: "pointer" }}>
                      <RefreshCw size={12} style={{ animation: d.loading ? "spin 1s linear infinite" : "none" }} />
                      {d.loading ? "Buscando..." : "Atualizar"}
                    </button>
                  )}

                  {d?.ads?.length > 0 && (
                    <button onClick={() => toggleExpand(c.id)} style={{ padding: "7px 10px", backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: "7px", cursor: "pointer", color: "var(--text-muted)" }}>
                      {d.expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  )}

                  <button onClick={() => removerConcorrente(c.id)} style={{ padding: "7px 10px", backgroundColor: "#ef444422", border: "1px solid #ef4444", borderRadius: "7px", cursor: "pointer", color: "#ef4444" }}>
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Erro */}
              {d?.error && (
                <div style={{ padding: "12px 22px", color: "#ef4444", fontSize: "12px", borderTop: "1px solid var(--border)" }}>
                  Erro: {d.error}
                </div>
              )}

              {/* Gráfico e anúncios */}
              {d?.ads?.length > 0 && d.expanded && (
                <div style={{ borderTop: "1px solid var(--border)" }}>
                  {/* Gráfico */}
                  <div style={{ padding: "20px 22px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "12px" }}>
                      Anúncios ativos — últimos 30 dias
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                      <LineChart data={series}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--text-muted)" }} interval={4} />
                        <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "12px" }}
                          labelStyle={{ color: "var(--text-primary)" }}
                          itemStyle={{ color: "#22c55e" }}
                        />
                        <Line type="monotone" dataKey="ativos" stroke="#22c55e" strokeWidth={2} dot={false} name="Anúncios ativos" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Tabela de anúncios recentes */}
                  <div style={{ borderTop: "1px solid var(--border)", padding: "0 22px 20px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", margin: "16px 0 10px" }}>
                      Anúncios encontrados ({d.ads.length})
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "300px", overflowY: "auto" }}>
                      {d.ads.slice(0, 20).map(ad => (
                        <div key={ad.id} style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border)", borderRadius: "7px", padding: "10px 14px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                              Início: {ad.ad_delivery_start_time?.slice(0, 10) || ad.ad_creation_time?.slice(0, 10) || "—"}
                            </span>
                            <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "4px", backgroundColor: !ad.ad_delivery_stop_time ? "#22c55e22" : "#6b728022", color: !ad.ad_delivery_stop_time ? "#22c55e" : "#9ca3af" }}>
                              {!ad.ad_delivery_stop_time ? "Ativo" : "Inativo"}
                            </span>
                          </div>
                          {ad.ad_creative_bodies?.[0] && (
                            <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", margin: 0 }}>
                              {ad.ad_creative_bodies[0]}
                            </p>
                          )}
                          {ad.publisher_platforms && (
                            <div style={{ display: "flex", gap: "4px", marginTop: "6px" }}>
                              {ad.publisher_platforms.map(p => (
                                <span key={p} style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "4px", backgroundColor: "var(--bg-hover)", color: "var(--text-secondary)" }}>{p}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
