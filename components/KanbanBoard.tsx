"use client";

import { useState } from "react";
import { Plus, X, DollarSign, TrendingUp, MoreHorizontal } from "lucide-react";

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

const INITIAL_CARDS: Card[] = [
  {
    id: "1",
    produto: "Produto Exemplo A",
    plataforma: "facebook",
    gasto: "R$ 120,00",
    faturamento: "R$ 480,00",
    cpa: "R$ 40,00",
    stage: "primeiras-vendas",
  },
  {
    id: "2",
    produto: "Produto Exemplo B",
    plataforma: "google",
    gasto: "R$ 80,00",
    faturamento: "R$ 0,00",
    cpa: "—",
    stage: "contingencia",
  },
];

const PLATAFORMA_COLORS: Record<string, string> = {
  facebook: "#1877f2",
  google: "#ea4335",
  ambos: "#a855f7",
};

export default function KanbanBoard() {
  const [cards, setCards] = useState<Card[]>(INITIAL_CARDS);
  const [showModal, setShowModal] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const [form, setForm] = useState({
    produto: "",
    plataforma: "facebook" as Card["plataforma"],
    gasto: "",
    faturamento: "",
    cpa: "",
    stage: "contingencia",
  });

  function addCard() {
    if (!form.produto.trim()) return;
    const newCard: Card = { ...form, id: Date.now().toString() };
    setCards((prev) => [...prev, newCard]);
    setShowModal(false);
    setForm({ produto: "", plataforma: "facebook", gasto: "", faturamento: "", cpa: "", stage: "contingencia" });
  }

  function moveCard(cardId: string, targetStage: string) {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, stage: targetStage } : c))
    );
  }

  function removeCard(id: string) {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div style={{ padding: "28px 32px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#f0f0f5" }}>
            Painel de Agentes
          </h1>
          <p style={{ fontSize: "13px", color: "#555570", marginTop: "4px" }}>
            Acompanhe seus produtos em cada estágio da operação
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            backgroundColor: "#22c55e",
            color: "#000",
            border: "none",
            borderRadius: "7px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <Plus size={14} />
          Novo Produto
        </button>
      </div>

      {/* Kanban */}
      <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "12px" }}>
        {STAGES.map((stage) => {
          const stageCards = cards.filter((c) => c.stage === stage.id);
          return (
            <div
              key={stage.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dragging && moveCard(dragging, stage.id)}
              style={{
                minWidth: "210px",
                width: "210px",
                backgroundColor: "#111118",
                border: "1px solid #1e1e2e",
                borderRadius: "10px",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {/* Stage Header */}
              <div
                style={{
                  padding: "10px 12px",
                  borderBottom: "1px solid #1e1e2e",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                <div
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor: stage.color,
                  }}
                />
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#f0f0f5" }}>
                  {stage.label}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "11px",
                    color: "#555570",
                    backgroundColor: "#1e1e2e",
                    padding: "1px 7px",
                    borderRadius: "10px",
                  }}
                >
                  {stageCards.length}
                </span>
              </div>

              {/* Cards */}
              <div style={{ padding: "8px", minHeight: "80px" }}>
                {stageCards.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={() => setDragging(card.id)}
                    onDragEnd={() => setDragging(null)}
                    style={{
                      backgroundColor: "#16161e",
                      border: "1px solid #2a2a3a",
                      borderRadius: "7px",
                      padding: "10px",
                      marginBottom: "8px",
                      cursor: "grab",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#f0f0f5",
                          lineHeight: 1.3,
                        }}
                      >
                        {card.produto}
                      </span>
                      <button
                        onClick={() => removeCard(card.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#555570",
                          padding: "0",
                          lineHeight: 1,
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>

                    <div
                      style={{
                        display: "inline-block",
                        padding: "2px 7px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: 600,
                        backgroundColor: PLATAFORMA_COLORS[card.plataforma] + "22",
                        color: PLATAFORMA_COLORS[card.plataforma],
                        marginBottom: "8px",
                        textTransform: "capitalize",
                      }}
                    >
                      {card.plataforma}
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <div>
                        <div style={{ fontSize: "10px", color: "#555570" }}>Gasto</div>
                        <div style={{ fontSize: "12px", color: "#ef4444", fontWeight: 600 }}>
                          {card.gasto || "—"}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "10px", color: "#555570" }}>Fat.</div>
                        <div style={{ fontSize: "12px", color: "#22c55e", fontWeight: 600 }}>
                          {card.faturamento || "—"}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: "10px", color: "#555570" }}>CPA</div>
                        <div style={{ fontSize: "12px", color: "#f0f0f5", fontWeight: 600 }}>
                          {card.cpa || "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#16161e",
              border: "1px solid #2a2a3a",
              borderRadius: "12px",
              padding: "24px",
              width: "380px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#f0f0f5" }}>
                Novo Produto
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "none", border: "none", color: "#555570", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            {[
              { label: "Nome do Produto", key: "produto", type: "text", placeholder: "Ex: Creme Anti-Age XYZ" },
              { label: "Gasto inicial (R$)", key: "gasto", type: "text", placeholder: "Ex: R$ 50,00" },
              { label: "Faturamento (R$)", key: "faturamento", type: "text", placeholder: "Ex: R$ 200,00" },
              { label: "CPA", key: "cpa", type: "text", placeholder: "Ex: R$ 40,00" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key} style={{ marginBottom: "14px" }}>
                <label
                  style={{ fontSize: "12px", color: "#8888aa", display: "block", marginBottom: "5px" }}
                >
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  style={{
                    width: "100%",
                    backgroundColor: "#0d0d15",
                    border: "1px solid #2a2a3a",
                    borderRadius: "7px",
                    padding: "8px 10px",
                    fontSize: "13px",
                    color: "#f0f0f5",
                    outline: "none",
                  }}
                />
              </div>
            ))}

            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontSize: "12px", color: "#8888aa", display: "block", marginBottom: "5px" }}>
                Plataforma
              </label>
              <select
                value={form.plataforma}
                onChange={(e) => setForm((f) => ({ ...f, plataforma: e.target.value as Card["plataforma"] }))}
                style={{
                  width: "100%",
                  backgroundColor: "#0d0d15",
                  border: "1px solid #2a2a3a",
                  borderRadius: "7px",
                  padding: "8px 10px",
                  fontSize: "13px",
                  color: "#f0f0f5",
                  outline: "none",
                }}
              >
                <option value="facebook">Facebook Ads</option>
                <option value="google">Google Ads</option>
                <option value="ambos">Ambos</option>
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontSize: "12px", color: "#8888aa", display: "block", marginBottom: "5px" }}>
                Estágio Inicial
              </label>
              <select
                value={form.stage}
                onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value }))}
                style={{
                  width: "100%",
                  backgroundColor: "#0d0d15",
                  border: "1px solid #2a2a3a",
                  borderRadius: "7px",
                  padding: "8px 10px",
                  fontSize: "13px",
                  color: "#f0f0f5",
                  outline: "none",
                }}
              >
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={addCard}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#22c55e",
                color: "#000",
                border: "none",
                borderRadius: "7px",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Adicionar Produto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
