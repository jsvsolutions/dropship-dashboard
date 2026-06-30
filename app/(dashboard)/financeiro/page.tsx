"use client";

import { useState, useEffect } from "react";
import { Plus, X, TrendingUp, TrendingDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Lancamento = {
  id: string;
  data: string;
  descricao: string;
  tipo: string;
  plataforma: string;
  valor: number;
};

const TIPO_LABELS: Record<string, string> = { receita: "Receita", "custo-produto": "Custo Produto", anuncio: "Anúncio", plataforma: "Plataforma", outros: "Outros" };
const TIPO_COLORS: Record<string, string> = { receita: "#22c55e", "custo-produto": "#ef4444", anuncio: "#3b82f6", plataforma: "#f59e0b", outros: "#8888aa" };

const EMPTY_FORM = { data: new Date().toLocaleDateString("pt-BR"), descricao: "", tipo: "receita", plataforma: "—", valor: "" };

export default function FinanceiroPage() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const supabase = createClient();

  useEffect(() => { loadLancamentos(); }, []);

  async function loadLancamentos() {
    const { data } = await supabase.from("lancamentos").select("*").order("created_at", { ascending: false });
    if (data) setLancamentos(data);
    setLoading(false);
  }

  async function addLancamento() {
    if (!form.descricao.trim() || !form.valor) return;
    const valor = parseFloat(String(form.valor).replace(",", "."));
    const finalValor = form.tipo === "receita" ? Math.abs(valor) : -Math.abs(valor);
    const payload = { ...form, valor: finalValor };
    const { data } = await supabase.from("lancamentos").insert([payload]).select().single();
    if (data) setLancamentos((prev) => [data, ...prev]);
    setShowModal(false);
    setForm(EMPTY_FORM);
  }

  async function removeLancamento(id: string) {
    await supabase.from("lancamentos").delete().eq("id", id);
    setLancamentos((prev) => prev.filter((l) => l.id !== id));
  }

  const receitas = lancamentos.filter((l) => l.valor > 0).reduce((s, l) => s + l.valor, 0);
  const custos = lancamentos.filter((l) => l.valor < 0).reduce((s, l) => s + Math.abs(l.valor), 0);
  const lucro = receitas - custos;
  const roas = custos > 0 ? (receitas / custos).toFixed(1) : "—";
  const fmt = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const inputStyle = { width: "100%", backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-dark)", borderRadius: "7px", padding: "8px 10px", fontSize: "13px", color: "var(--text-primary)", outline: "none" };

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>Financeiro</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Controle de receitas e custos da operação</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", backgroundColor: "var(--accent)", color: "#000", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
          <Plus size={14} /> Lançamento
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", marginBottom: "28px" }}>
        {[
          { label: "Faturamento", value: fmt(receitas), color: "#22c55e", icon: TrendingUp },
          { label: "Custos Totais", value: fmt(custos), color: "#ef4444", icon: TrendingDown },
          { label: "Lucro Líquido", value: fmt(lucro), color: lucro >= 0 ? "#22c55e" : "#ef4444", icon: lucro >= 0 ? TrendingUp : TrendingDown },
          { label: "ROAS", value: roas === "—" ? "—" : roas + "x", color: "#3b82f6", icon: TrendingUp },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{label}</span>
              <Icon size={14} color={color} />
            </div>
            <div style={{ fontSize: "20px", fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Lançamentos</span>
        </div>
        {loading ? (
          <div style={{ padding: "20px 16px", color: "var(--text-muted)", fontSize: "13px" }}>Carregando...</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Data", "Descrição", "Tipo", "Valor", ""].map((h) => (
                  <th key={h} style={{ padding: "10px 16px", fontSize: "11px", color: "var(--text-muted)", textAlign: "left", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lancamentos.map((l) => (
                <tr key={l.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "11px 16px", fontSize: "12px", color: "var(--text-secondary)" }}>{l.data}</td>
                  <td style={{ padding: "11px 16px", fontSize: "13px", color: "var(--text-primary)" }}>{l.descricao}</td>
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", backgroundColor: (TIPO_COLORS[l.tipo] || "#888") + "22", color: TIPO_COLORS[l.tipo] || "#888", fontWeight: 600 }}>
                      {TIPO_LABELS[l.tipo] || l.tipo}
                    </span>
                  </td>
                  <td style={{ padding: "11px 16px", fontSize: "13px", fontWeight: 700, color: l.valor >= 0 ? "#22c55e" : "#ef4444" }}>
                    {l.valor >= 0 ? "+" : ""}{fmt(l.valor)}
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <button onClick={() => removeLancamento(l.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}><X size={13} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={() => setShowModal(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-dark)", borderRadius: "12px", padding: "24px", width: "380px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>Novo Lançamento</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={16} /></button>
            </div>
            {[
              { label: "Data", key: "data", placeholder: "DD/MM/AAAA" },
              { label: "Descrição", key: "descricao", placeholder: "Ex: Vendas do dia" },
              { label: "Valor (R$)", key: "valor", placeholder: "Ex: 480,00" },
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "5px" }}>{label}</label>
                <input type="text" placeholder={placeholder} value={form[key as keyof typeof form]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "5px" }}>Tipo</label>
              <select value={form.tipo} onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value }))} style={inputStyle}>
                <option value="receita">Receita (entrada)</option>
                <option value="anuncio">Anúncio (saída)</option>
                <option value="custo-produto">Custo do Produto (saída)</option>
                <option value="plataforma">Plataforma (saída)</option>
                <option value="outros">Outros</option>
              </select>
            </div>
            <button onClick={addLancamento} style={{ width: "100%", padding: "10px", backgroundColor: "var(--accent)", color: "#000", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
              Salvar Lançamento
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
