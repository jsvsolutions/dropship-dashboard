"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Image, DollarSign,
  TrendingUp, Settings, Zap, Sun, Moon, LogOut, Tag, ScanSearch, ShieldAlert, NotebookPen,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agentes", label: "Painel de Agentes", icon: Users },
  { href: "/financeiro", label: "Financeiro", icon: DollarSign },
  { href: "/ofertas", label: "Ofertas", icon: Tag },
  { href: "/mineracao", label: "Mineração", icon: ScanSearch },
  { href: "/contingencia", label: "Contingência", icon: ShieldAlert },
  { href: "/notas", label: "Notas", icon: NotebookPen },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside style={{
      width: "220px", minWidth: "220px",
      backgroundColor: "var(--sidebar-bg)",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
      height: "100vh", position: "sticky", top: 0,
      transition: "background-color 0.2s",
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "28px", height: "28px", backgroundColor: "var(--accent)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Zap size={16} color="#000" />
        </div>
        <span style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-primary)" }}>DropDash</span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Nav */}
      <nav style={{ padding: "0 8px 8px" }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "9px 10px", borderRadius: "7px", marginBottom: "2px",
                fontSize: "13px", fontWeight: active ? 600 : 400,
                color: active ? "var(--accent)" : "var(--text-secondary)",
                backgroundColor: active ? "var(--sidebar-active)" : "transparent",
                textDecoration: "none", transition: "all 0.15s",
              }}
            >
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid var(--border)" }}>
        {/* Theme toggle */}
        <button
          onClick={toggle}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "9px 10px", borderRadius: "7px", width: "100%",
            fontSize: "13px", color: "var(--text-muted)",
            background: "none", border: "none", cursor: "pointer",
            marginBottom: "2px",
          }}
        >
          {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          {theme === "dark" ? "Tema Claro" : "Tema Escuro"}
        </button>

        <button
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "9px 10px", borderRadius: "7px", width: "100%",
            fontSize: "13px", color: "#ef4444",
            background: "none", border: "none", cursor: "pointer",
            marginBottom: "2px",
          }}
        >
          <LogOut size={15} />
          Sair
        </button>

        <Link
          href="/configuracoes"
          style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "9px 10px", borderRadius: "7px",
            fontSize: "13px", color: "var(--text-muted)", textDecoration: "none",
          }}
        >
          <Settings size={15} />
          Configurações
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 10px 2px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#000" }}>
            U
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "var(--text-primary)", fontWeight: 600 }}>Usuário</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
