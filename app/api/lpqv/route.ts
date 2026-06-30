import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.LPQV_TOKEN;
  const slug = process.env.LPQV_SLUG;

  if (!token || !slug) {
    return NextResponse.json({ error: "LPQV não configurado" }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.lpquevende.com/${slug}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // cache 5 minutos
    });

    if (!res.ok) throw new Error(`LPQV API error: ${res.status}`);

    const data = await res.json();
    const orders: any[] = data.result || [];

    const hoje = new Date().toISOString().slice(0, 10);
    const mesAtual = new Date().toISOString().slice(0, 7);

    const pagos = orders.filter((o) => o.status === "payment_accept");
    const pedidosHoje = pagos.filter((o) => o.creat_at?.startsWith(hoje));
    const pedidosMes = pagos.filter((o) => o.creat_at?.startsWith(mesAtual));

    const faturamentoHoje = pedidosHoje.reduce((s, o) => s + parseFloat(o.payment_subtotal || 0), 0);
    const faturamentoMes = pedidosMes.reduce((s, o) => s + parseFloat(o.payment_subtotal || 0), 0);
    const faturamentoTotal = pagos.reduce((s, o) => s + parseFloat(o.payment_subtotal || 0), 0);

    const ticketMedio = pedidosHoje.length > 0 ? faturamentoHoje / pedidosHoje.length : 0;

    return NextResponse.json({
      pedidosHoje: pedidosHoje.length,
      pedidosMes: pedidosMes.length,
      pedidosTotal: pagos.length,
      faturamentoHoje,
      faturamentoMes,
      faturamentoTotal,
      ticketMedio,
      cancelados: orders.filter((o) => o.status === "canceled").length,
      aguardando: orders.filter((o) => o.status === "order_created").length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
