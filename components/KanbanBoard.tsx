"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

const STAGES = [
  { id: "contingencia", label: "Contingência", color: "#f59e0b" },
  { id: "aprovacao", label: "Aprovação", color: "#3b82f6" },
  { id: "entrega", label: "Entrega", color: "#8b5cf6" },
  { id: "primeiras-vendas", label: "Primeiras Vendas", color: "#22c55e" },
  { id: "pre-escala", label: "Pré-Escala", color: "#06b6d4" },
  { id: "escala", label: "Escala", color: "#10b981" },
  { id: "bloqueio", label: "Bloqueio", color: "#ef4444" },
];

type Card = {
  id: string;
  produto: string;
  plataforma: "facebook" | "google" | "ambos";
  gasto: string;
  faturamento: string;
  cpa: string;
  stage: string;
};

const PLATAFORMA_COLORS: Record<string, string> = {
  facebook: "#1877f2",
  google: "#ea4335",
  ambos: "#a855f7",
};

const INITIAL_CARDS: Card[] = [
  { id: "1", produto: "Produto Exemplo A", plataforma: "facebook", gasto: "R$ 120,00", faturamento: "R$ 480,00", cpa: "R$ 40,00", stage: "primeiras-vendas" },
  { id: "2", produto: "Produto Exemplo B", plataforma: "google", gasto: "R$ 80,00", faturamento: "R$ 0,00", cpa: "—", stage: "contingencia" },
];

export default function KanbanBoard() {
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [showModal, setShowModal] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const [form, setForm] = useState({ produto: "", plataforma: "facebook" as Card["plataforma"], gasto: "", faturamento: "", cpa: "", stage: "contingencia" });

  function addCard() {
    if (!form.produto.trim()) return;
    setCards((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    setShowModal(false);
    setForm({ produto: "", plataforma: "facebook", gasto: "", faturamento: "", cpa: "", stage: "contingencia" });
  }

  function moveCard(cardId: string, targetStage: string) {
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, stage: targetStage } : c)));
  }

  function removeCard(id: string) {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  const inputStyle = { width: "100%", backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-dark)", borderRadius: "7px", padding: "8px 10px", fontSize: "13px", color: "var(--text-primary)", outline: "none" };

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>Painel de Agentes</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Acompanhe seus produtos em cada estágio da operação</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", backgroundColor: "var(--accent)", color: "#000", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
          <Plus size={14} /> Novo Produto
        </button>
      </div>

      <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "12px" }}>
        {STAGES.map((stage) => {
          const stageCards = cards.filter((c) => c.stage === stage.id);
          return (
            <div key={stage.id} onDragOver={(e) => e.preventDefault()} onDrop={() => dragging && moveCard(dragging, stage.id)}
              style={{ minWidth: "210px", width: "210px", backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", flexShrink: 0 }}>
              <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "7px" }}>
                <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: stage.color }} />
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>{stage.label}</span>
                <span style={{ marginLeft: "auto", fontSize: "11px", color: "var(--text-muted)", backgroundColor: "var(--bg-hover)", padding: "1px 7px", borderRadius: "10px" }}>
                  {stageCards.length}
                </span>
              </div>
              <div style={{ padding: "8px", minHeight: "80px" }}>
                {stageCards.map((card) => (
                  <div key={card.id} draggable onDragStart={() => setDragging(card.id)} onDragEnd={() => setDragging(null)}
                    style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-dark)", borderRadius: "7px", padding: "10px", marginBottom: "8px", cursor: "grab" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3 }}>{card.produto}</span>
                      <button onClick={() => removeCard(card.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "0", lineHeight: 1 }}>
                        <X size={12} />
                      </button>
                    </div>
                    <div style={{ display: "inline-block", padding: "2px 7px", borderRadius: "4px", fontSize: "10px", fontWeight: 600, backgroundColor: PLATAFORMA_COLORS[card.plataforma] + "22", color: PLATAFORMA_COLORS[card.plataforma], marginBottom: "8px", textTransform: "capitalize" }}>
                      {card.plataforma}
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      {[["Gasto", card.gasto, "#ef4444"], ["Fat.", card.faturamento, "#22c55e"], ["CPA", card.cpa, "var(--text-primary)"]].map(([lbl, val, color]) => (
                        <div key={lbl}>
                          <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>{lbl}</div>
                          <div style={{ fontSize: "12px", color, fontWeight: 600 }}>{val || "—"}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={() => setShowModal(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-dark)", borderRadius: "12px", padding: "24px", width: "380px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>Novo Produto</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}><X size={16} /></button>
            </div>

            {[
              { label: "Nome do Produto", key: "produto", placeholder: "Ex: Creme Anti-Age XYZ" },
              { label: "Gasto inicial", key: "gasto", placeholder: "Ex: R$ 50,00" },
              { label: "Faturamento", key: "faturamento", placeholder: "Ex: R$ 200,00" },
              { label: "CPA", key: "cpa", placeholder: "Ex: R$ 40,00" },
            ].map(({ label, key, placeholder }) => (
              <div key={key} style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "5px" }}>{label}</label>
                <input type="text" placeholder={placeholder} value={form[key as keyof typeof form]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}

            {[
              { label: "Plataforma", key: "plataforma", options: [["facebook", "Facebook Ads"], ["google", "Google Ads"], ["ambos", "Ambos"]] },
              { label: "Estágio Inicial", key: "stage", options: STAGES.map((s) => [s.id, s.label]) },
            ].map(({ label, key, options }) => (
              <div key={key} style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "12px", color: "var(--text-secondary)", display: "block", marginBottom: "5px" }}>{label}</label>
                <select value={form[key as keyof typeof form]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} style={inputStyle}>
                  {options.map(([val, lbl]) => <option key={val} value={val}>{lbl}</option>)}
                </select>
              </div>
            ))}

            <button onClick={addCard} style={{ width: "100%", marginTop: "6px", padding: "10px", backgroundColor: "var(--accent)", color: "#000", border: "none", borderRadius: "7px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
              Adicionar Produto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
