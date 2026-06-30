import { DollarSign, TrendingUp, ShoppingCart, Target, BarChart2, AlertTriangle } from "lucide-react";

const kpis = [
  {
    label: "Faturamento Hoje",
    value: "R$ 0,00",
    sub: "Atualizado agora",
    icon: DollarSign,
    color: "#22c55e",
  },
  {
    label: "Gasto em Anúncios",
    value: "R$ 0,00",
    sub: "Facebook + Google",
    icon: Target,
    color: "#3b82f6",
  },
  {
    label: "Lucro Líquido",
    value: "R$ 0,00",
    sub: "Faturamento − custos",
    icon: TrendingUp,
    color: "#a855f7",
  },
  {
    label: "Pedidos",
    value: "0",
    sub: "Hoje",
    icon: ShoppingCart,
    color: "#f59e0b",
  },
  {
    label: "ROAS",
    value: "0x",
    sub: "Retorno sobre anúncio",
    icon: BarChart2,
    color: "#06b6d4",
  },
  {
    label: "CPA Médio",
    value: "R$ 0,00",
    sub: "Custo por aquisição",
    icon: AlertTriangle,
    color: "#ef4444",
  },
];

const stages = [
  { label: "Contingência", count: 0, color: "#f59e0b" },
  { label: "Aprovação", count: 0, color: "#3b82f6" },
  { label: "Primeiras Vendas", count: 0, color: "#22c55e" },
  { label: "Pré-Escala", count: 0, color: "#a855f7" },
  { label: "Escala", count: 0, color: "#06b6d4" },
  { label: "Bloqueio", count: 0, color: "#ef4444" },
];

export default function DashboardPage() {
  return (
    <div style={{ padding: "28px 32px", maxWidth: "1400px" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#f0f0f5" }}>
          Dashboard
        </h1>
        <p style={{ fontSize: "13px", color: "#555570", marginTop: "4px" }}>
          Visão geral da operação — hoje
        </p>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "14px",
          marginBottom: "32px",
        }}
      >
        {kpis.map(({ label, value, sub, icon: Icon, color }) => (
          <div
            key={label}
            style={{
              backgroundColor: "#111118",
              border: "1px solid #1e1e2e",
              borderRadius: "10px",
              padding: "18px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "12px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#8888aa" }}>{label}</span>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "7px",
                  backgroundColor: color + "22",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={14} color={color} />
              </div>
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#f0f0f5" }}>
              {value}
            </div>
            <div style={{ fontSize: "11px", color: "#555570", marginTop: "4px" }}>
              {sub}
            </div>
          </div>
        ))}
      </div>

      {/* Resumo dos Estágios */}
      <div style={{ marginBottom: "12px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#8888aa", marginBottom: "14px" }}>
          Produtos por Estágio
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "10px",
          }}
        >
          {stages.map(({ label, count, color }) => (
            <div
              key={label}
              style={{
                backgroundColor: "#111118",
                border: "1px solid #1e1e2e",
                borderRadius: "8px",
                padding: "14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: "11px", color: "#8888aa" }}>{label}</div>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "#f0f0f5" }}>
                  {count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
