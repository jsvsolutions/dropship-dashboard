import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "DropDash — Painel de Operações",
  description: "Dashboard de dropshipping com tráfego direto",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="h-full flex" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
        <ThemeProvider>
          <Sidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
