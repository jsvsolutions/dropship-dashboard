"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Image,
  DollarSign,
  TrendingUp,
  Settings,
  Zap,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agentes", label: "Painel de Agentes", icon: Users },
  { href: "/criativos", label: "Criativos & Copies", icon: Image },
  { href: "/financeiro", label: "Financeiro", icon: DollarSign },
  { href: "/escalas", label: "Performance", icon: TrendingUp },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "220px",
        minWidth: "220px",
        backgroundColor: "#0d0d15",
        borderRight: "1px solid #1e1e2e",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "20px 16px",
          borderBottom: "1px solid #1e1e2e",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            backgroundColor: "#22c55e",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Zap size={16} color="#000" />
        </div>
        <span style={{ fontWeight: 700, fontSize: "15px", color: "#f0f0f5" }}>
          DropDash
        </span>
      </div>

      {/* Squad label */}
      <div style={{ padding: "16px 16px 8px" }}>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.1em",
            color: "#555570",
            textTransform: "uppercase",
          }}
        >
          Squad Camaleão
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "0 8px" }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 10px",
                borderRadius: "7px",
                marginBottom: "2px",
                fontSize: "13px",
                fontWeight: active ? 600 : 400,
                color: active ? "#22c55e" : "#8888aa",
                backgroundColor: active ? "#0f2a1a" : "transparent",
                textDecoration: "none",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#16161e";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#f0f0f5";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#8888aa";
                }
              }}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid #1e1e2e" }}>
        <Link
          href="/configuracoes"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "9px 10px",
            borderRadius: "7px",
            fontSize: "13px",
            color: "#555570",
            textDecoration: "none",
          }}
        >
          <Settings size={15} />
          Configurações
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 10px 2px",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
              fontWeight: 700,
              color: "#000",
            }}
          >
            U
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#f0f0f5", fontWeight: 600 }}>
              Usuário
            </div>
            <div style={{ fontSize: "11px", color: "#555570" }}>Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
