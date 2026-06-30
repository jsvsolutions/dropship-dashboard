"use client";

import { useState } from "react";
import { Plus, X, TrendingUp, TrendingDown } from "lucide-react";

type Lancamento = {
  id: string;
  data: string;
  descricao: string;
  tipo: "receita" | "custo-produto" | "anuncio" | "plataforma" | "outros";
  plataforma: "facebook" | "google" | "ambos" | "—";
  valor: number;
};

const TIPO_LABELS: Record<string, string> = {
  receita: "Receita",
  "custo-produto": "Custo Produto",
  anuncio: "Anúncio",
  plataforma: "Plataforma",
  outros: "Outros",
};

const TIPO_COLORS: Record<string, string> = {
  receita: "#22c55e",
  "custo-produto": "#ef4444",
  anuncio: "#3b82f6",
  plataforma: "#f59e0b",
  outros: "#8888aa",
};

const INITIAL: Lancamento[] = [
  { id: "1", data: "30/06/2026", descricao: "Vendas do dia", tipo: "receita", plataforma: "—", valor: 480 },
  { id: "2", data: "30/06/2026", descricao: "Facebook Ads", tipo: "anuncio", plataforma: "facebook", valor: -120 },
  { id: "3", data: "30/06/2026", descricao: "Custo produto + frete", tipo: "custo-produto", plataforma: "—", valor: -160 },
];

export default function FinanceiroPage() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>(INITIAL);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    data: new Date().toLocaleDateString("pt-BR"),
    descricao: "",
    tipo: "receita" as Lancamento["tipo"],
    plataforma: "—" as Lancamento["plataforma"],
    valor: "",
  });

  const receitas = lancamentos.filter((l) => l.valor > 0).reduce((s, l) => s + l.valor, 0);
  const custos = lancamentos.filter((l) => l.valor < 0).reduce((s, l) => s + Math.abs(l.valor), 0);
  const lucro = receitas - custos;
  const roas = custos > 0 ? (receitas / custos).toFixed(1) : "—";

  function addLancamento() {
    if (!form.descricao.trim() || !form.valor) return;
    const valor = parseFloat(form.valor.replace(",", "."));
    const finalValor = form.tipo === "receita" ? Math.abs(valor) : -Math.abs(valor);
    setLancamentos((prev) => [...prev, { ...form, id: Date.now().toString(), valor: finalValor }]);
    setShowModal(false);
    setForm({ data: new Date().toLocaleDateString("pt-BR"), descricao: "", tipo: "receita", plataforma: "—", valor: "" });
  }

  function fmt(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#f0f0f5" }}>Financeiro</h1>
          <p style={{ fontSize: "13px", color: "#555570", marginTop: "4px" }}>Controle de receitas e custos da operação</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", backgroundColor: "#22c55e", color: "#000", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
        >
          <Plus size={14} />
          Lançamento
        </button>
      </div>

      {/* Resumo */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", marginBottom: "28px" }}>
        {[
          { label: "Faturamento", value: fmt(receitas), color: "#22c55e", icon: TrendingUp },
          { label: "Custos Totais", value: fmt(custos), color: "#ef4444", icon: TrendingDown },
          { label: "Lucro Líquido", value: fmt(lucro), color: lucro >= 0 ? "#22c55e" : "#ef4444", icon: lucro >= 0 ? TrendingUp : TrendingDown },
          { label: "ROAS", value: roas === "—" ? "—" : roas + "x", color: "#3b82f6", icon: TrendingUp },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} style={{ backgroundColor: "#111118", border: "1px solid #1e1e2e", borderRadius: "10px", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "12px", color: "#8888aa" }}>{label}</span>
              <Icon size={14} color={color} />
            </div>
            <div style={{ fontSize: "20px", fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Tabela */}
      <div style={{ backgroundColor: "#111118", border: "1px solid #1e1e2e", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #1e1e2e" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#f0f0f5" }}>Lançamentos</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e1e2e" }}>
              {["Data", "Descrição", "Tipo", "Plataforma", "Valor"].map((h) => (
                <th key={h} style={{ padding: "10px 16px", fontSize: "11px", color: "#555570", textAlign: "left", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lancamentos.map((l) => (
              <tr key={l.id} style={{ borderBottom: "1px solid #1a1a28" }}>
                <td style={{ padding: "11px 16px", fontSize: "12px", color: "#8888aa" }}>{l.data}</td>
                <td style={{ padding: "11px 16px", fontSize: "13px", color: "#f0f0f5" }}>{l.descricao}</td>
                <td style={{ padding: "11px 16px" }}>
                  <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", backgroundColor: TIPO_COLORS[l.tipo] + "22", color: TIPO_COLORS[l.tipo], fontWeight: 600 }}>
                    {TIPO_LABELS[l.tipo]}
                  </span>
                </td>
                <td style={{ padding: "11px 16px", fontSize: "12px", color: "#8888aa" }}>{l.plataforma}</td>
                <td style={{ padding: "11px 16px", fontSize: "13px", fontWeight: 700, color: l.valor >= 0 ? "#22c55e" : "#ef4444" }}>
                  {l.valor >= 0 ? "+" : ""}{fmt(l.valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ backgroundColor: "#16161e", border: "1px solid #2a2a3a", borderRadius: "12px", padding: "24px", width: "380px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#f0f0f5" }}>Novo Lançamento</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "#555570", cursor: "pointer" }}>
                <X size={16} />
              </button>
            </div>

            {[
              { label: "Data", key: "data", placeholder: "DD/MM/AAAA" },
              { label: "Descrição", key: "descricao", placeholder: "Ex: Vendas do dia" },
              { label: "Valor (R$)", key: "valor", placeholder: "Ex: 480,00" },
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
              <label style={{ fontSize: "12px", color: "#8888aa", display: "block", marginBottom: "5px" }}>Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) => setForm((f) => ({ ...f, tipo: e.target.value as Lancamento["tipo"] }))}
                style={{ width: "100%", backgroundColor: "#0d0d15", border: "1px solid #2a2a3a", borderRadius: "7px", padding: "8px 10px", fontSize: "13px", color: "#f0f0f5", outline: "none" }}
              >
                <option value="receita">Receita (entrada)</option>
                <option value="anuncio">Anúncio (saída)</option>
                <option value="custo-produto">Custo do Produto (saída)</option>
                <option value="plataforma">Plataforma (saída)</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            <button
              onClick={addLancamento}
              style={{ width: "100%", marginTop: "8px", padding: "10px", backgroundColor: "#22c55e", color: "#000", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
            >
              Salvar Lançamento
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
