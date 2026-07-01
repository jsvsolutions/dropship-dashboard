import { NextResponse } from "next/server";

const TOKEN = process.env.UTMIFY_TOKEN ?? "Pbwjakj1WA0kpBScmW166OQECsTJWNIK";
const DASHBOARD_ID = process.env.UTMIFY_DASHBOARD_ID ?? "69d3af56f61cd6158e957909";
const MCP_URL = `https://mcp.utmify.com.br/mcp/?token=${TOKEN}&resources=gs`;
const MCP_HEADERS = {
  "Content-Type": "application/json",
  "Accept": "application/json, text/event-stream",
};

async function callSummary(from: string, to: string) {
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: MCP_HEADERS,
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "get_dashboard_summary",
        arguments: {
          dashboardId: DASHBOARD_ID,
          dateRange: { from, to },
          timeZoneIana: "UTC-3",
        },
      },
    }),
  });
  const json = await res.json();
  if (json.result?.isError) throw new Error(json.result.content[0].text);
  return JSON.parse(json.result.content[0].text);
}

function gmt3Today() {
  const gmt3 = new Date(Date.now() - 3 * 60 * 60 * 1000);
  const y = gmt3.getUTCFullYear();
  const m = String(gmt3.getUTCMonth() + 1).padStart(2, "0");
  const d = String(gmt3.getUTCDate()).padStart(2, "0");
  return { y, m, d };
}

function cents(v: number | null | undefined) {
  return v == null ? null : Math.round(v) / 100;
}

export async function GET() {
  try {
    const { y, m, d } = gmt3Today();
    const todayFrom = `${y}-${m}-${d}T00:00:00-03:00`;
    const todayTo = `${y}-${m}-${d}T23:59:59-03:00`;
    const monthFrom = `${y}-${m}-01T00:00:00-03:00`;

    const [hoje, mes] = await Promise.all([
      callSummary(todayFrom, todayTo),
      callSummary(monthFrom, todayTo),
    ]);

    return NextResponse.json({
      hoje: {
        faturamento: cents(hoje.comissions.gross),
        pedidos: hoje.ordersCount.approved,
        pendentes: hoje.ordersCount.pending,
        cancelados: hoje.ordersCount.refunded + hoje.ordersCount.chargedback,
        investimento: cents(hoje.ads.spent),
        lucro: cents(hoje.analytics.profit),
        roas: hoje.analytics.roas,
        roi: hoje.analytics.roi,
        ticketMedio: cents(hoje.analytics.avgTicket),
        margem: hoje.analytics.profitMargin,
      },
      mes: {
        faturamento: cents(mes.comissions.gross),
        pedidos: mes.ordersCount.approved,
        pendentes: mes.ordersCount.pending,
        cancelados: mes.ordersCount.refunded + mes.ordersCount.chargedback,
        investimento: cents(mes.ads.spent),
        lucro: cents(mes.analytics.profit),
        roas: mes.analytics.roas,
        ticketMedio: cents(mes.analytics.avgTicket),
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
