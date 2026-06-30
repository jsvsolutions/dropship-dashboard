"use client";

import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, ShoppingCart, Target, BarChart2, AlertTriangle, RefreshCw } from "lucide-react";

type LPQVData = {
  pedidosHoje: number;
  pedidosMes: number;
  pedidosTotal: number;
  faturamentoHoje: number;
  faturamentoMes: number;
  faturamentoTotal: number;
  ticketMedio: number;
  cancelados: number;
  aguardando: number;
};

const stages = [
  { label: "Contingência", count: 0, color: "#f59e0b" },
  { label: "Aprovação", count: 0, color: "#3b82f6" },
  { label: "Primeiras Vendas", count: 0, color: "#22c55e" },
  { label: "Pré-Escala", count: 0, color: "#a855f7" },
  { label: "Escala", count: 0, color: "#06b6d4" },
  { label: "Bloqueio", count: 0, color: "#ef4444" },
];

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function DashboardPage() {
  const [lpqv, setLpqv] = useState<LPQVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("");

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/lpqv");
      const data = await res.json();
      if (!data.error) {
        setLpqv(data);
        setLastUpdate(new Date().toLocaleTimeString("pt-BR"));
      }
    } catch {}
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  const kpis = [
    {
      label: "Faturamento Hoje",
      value: lpqv ? fmt(lpqv.faturamentoHoje) : "—",
      sub: lastUpdate ? `Atualizado às ${lastUpdate}` : "Carregando...",
      icon: DollarSign,
      color: "#22c55e",
    },
    {
      label: "Pedidos Hoje",
      value: lpqv ? String(lpqv.pedidosHoje) : "—",
      sub: "Pedidos pagos hoje",
      icon: ShoppingCart,
      color: "#f59e0b",
    },
    {
      label: "Ticket Médio",
      value: lpqv ? fmt(lpqv.ticketMedio) : "—",
      sub: "Valor médio por pedido",
      icon: BarChart2,
      color: "#06b6d4",
    },
    {
      label: "Faturamento do Mês",
      value: lpqv ? fmt(lpqv.faturamentoMes) : "—",
      sub: `${lpqv?.pedidosMes ?? "—"} pedidos no mês`,
      icon: TrendingUp,
      color: "#a855f7",
    },
    {
      label: "Faturamento Total",
      value: lpqv ? fmt(lpqv.faturamentoTotal) : "—",
      sub: `${lpqv?.pedidosTotal ?? "—"} pedidos pagos`,
      icon: Target,
      color: "#3b82f6",
    },
    {
      label: "Cancelados",
      value: lpqv ? String(lpqv.cancelados) : "—",
      sub: `${lpqv?.aguardando ?? "—"} aguardando pagto`,
      icon: AlertTriangle,
      color: "#ef4444",
    },
  ];

  return (
    <div style={{ padding: "28px 32px", maxWidth: "1400px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>Dashboard</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>
            Dados em tempo real da sua loja LPQV
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px", marginBottom: "32px" }}>
        {kpis.map(({ label, value, sub, icon: Icon, color }) => (
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
