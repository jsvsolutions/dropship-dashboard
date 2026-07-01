"use client";

import { useEffect, useState } from "react";
import {
  DollarSign, TrendingUp, ShoppingCart, Zap,
  BarChart2, AlertTriangle, RefreshCw, Target, TrendingDown, Percent,
} from "lucide-react";

type UTMData = {
  hoje: {
    faturamento: number;
    pedidos: number;
    pendentes: number;
    cancelados: number;
    investimento: number;
    lucro: number;
    roas: number | null;
    roi: number | null;
    ticketMedio: number | null;
    margem: number | null;
  };
  mes: {
    faturamento: number;
    pedidos: number;
    pendentes: number;
    cancelados: number;
    investimento: number;
    lucro: number;
    roas: number | null;
    ticketMedio: number | null;
  };
};

const stages = [
  { label: "Contingência", count: 0, color: "#f59e0b" },
  { label: "Aprovação", count: 0, color: "#3b82f6" },
  { label: "Primeiras Vendas", count: 0, color: "#22c55e" },
  { label: "Pré-Escala", count: 0, color: "#a855f7" },
  { label: "Escala", count: 0, color: "#06b6d4" },
  { label: "Bloqueio", count: 0, color: "#ef4444" },
];

function fmt(v: number | null) {
  if (v == null) return "—";
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function fmtN(v: number | null, decimals = 2) {
  if (v == null) return "—";
  return v.toFixed(decimals).replace(".", ",");
}
function fmtPct(v: number | null) {
  if (v == null) return "—";
  return (v * 100).toFixed(1) + "%";
}

export default function DashboardPage() {
  const [data, setData] = useState<UTMData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");
  const [erro, setErro] = useState("");

  async function fetchData() {
    setLoading(true);
    setErro("");
    try {
      const res = await fetch("/api/utmify");
      const json = await res.json();
      if (json.error) { setErro(json.error); }
      else { setData(json); setLastUpdate(new Date().toLocaleTimeString("pt-BR")); }
    } catch (e: any) { setErro(e.message); }
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  const hoje = data?.hoje;
  const mes = data?.mes;

  const kpisHoje = [
    {
      label: "Faturamento Hoje",
      value: fmt(hoje?.faturamento ?? null),
      sub: hoje ? `${hoje.pedidos} pedidos aprovados` : "Carregando...",
      icon: DollarSign, color: "#22c55e",
    },
    {
      label: "Pedidos Hoje",
      value: hoje != null ? String(hoje.pedidos) : "—",
      sub: hoje ? `${hoje.pendentes} aguardando pagto` : "",
      icon: ShoppingCart, color: "#f59e0b",
    },
    {
      label: "Ticket Médio",
      value: fmt(hoje?.ticketMedio ?? null),
      sub: "Por pedido aprovado hoje",
      icon: BarChart2, color: "#06b6d4",
    },
    {
      label: "Investimento",
      value: fmt(hoje?.investimento ?? null),
      sub: "Meta Ads hoje",
      icon: Target, color: "#3b82f6",
    },
    {
      label: "ROAS",
      value: fmtN(hoje?.roas ?? null),
      sub: "Retorno sobre investimento em ads",
      icon: TrendingUp, color: "#a855f7",
    },
    {
      label: "Lucro",
      value: fmt(hoje?.lucro ?? null),
      sub: fmtPct(hoje?.margem ?? null) + " margem",
      icon: Percent, color: "#10b981",
    },
    {
      label: "Faturamento do Mês",
      value: fmt(mes?.faturamento ?? null),
      sub: mes ? `${mes.pedidos} pedidos aprovados` : "",
      icon: TrendingUp, color: "#f97316",
    },
    {
      label: "Cancelados Hoje",
      value: hoje != null ? String(hoje.cancelados) : "—",
      sub: mes ? `${mes.cancelados} cancelados no mês` : "",
      icon: AlertTriangle, color: "#ef4444",
    },
  ];

  return (
    <div style={{ padding: "28px 32px", maxWidth: "1400px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>Dashboard</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            {lastUpdate ? `Atualizado às ${lastUpdate}` : "Dados em tempo real via UTMify"}
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "7px 12px", backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border)", borderRadius: "7px",
            fontSize: "12px", color: "var(--text-secondary)", cursor: "pointer",
          }}
        >
          <RefreshCw size={13} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
          Atualizar
        </button>
      </div>

      {erro && (
        <div style={{ backgroundColor: "#ef444422", border: "1px solid #ef4444", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", fontSize: "13px", color: "#ef4444" }}>
          Erro ao carregar dados: {erro}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px", marginBottom: "32px" }}>
        {kpisHoje.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "10px", padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{label}</span>
              <div style={{ width: "28px", height: "28px", borderRadius: "7px", backgroundColor: color + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={14} color={color} />
              </div>
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)" }}>
              {loading ? <span style={{ color: "var(--text-muted)", fontSize: "16px" }}>...</span> : value}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Resumo do mês — faixa secundária */}
      {mes && !loading && (
        <div style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px 20px", marginBottom: "32px", display: "flex", gap: "32px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>Investimento do Mês</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>{fmt(mes.investimento)}</div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>Lucro do Mês</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#10b981" }}>{fmt(mes.lucro)}</div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>ROAS do Mês</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>{fmtN(mes.roas)}</div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>Ticket Médio do Mês</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>{fmt(mes.ticketMedio)}</div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>Pendentes do Mês</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#f59e0b" }}>{mes.pendentes}</div>
          </div>
        </div>
      )}

      <div>
        <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "14px" }}>
          Produtos por Estágio
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "10px" }}>
          {stages.map(({ label, count, color }) => (
            <div key={label} style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "8px", padding: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{label}</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>{count}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
