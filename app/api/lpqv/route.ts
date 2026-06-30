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

    // campo de data pode variar entre creat_at / created_at / order_date
    const getDate = (o: any): string =>
      o.creat_at || o.created_at || o.order_date || o.date || "";

    const pedidosHoje = pagos.filter((o) => getDate(o).startsWith(hoje));
    const pedidosMes = pagos.filter((o) => getDate(o).startsWith(mesAtual));

    const faturamentoHoje = pedidosHoje.reduce((s, o) => s + parseFloat(o.payment_subtotal || o.total || 0), 0);
    const faturamentoMes = pedidosMes.reduce((s, o) => s + parseFloat(o.payment_subtotal || o.total || 0), 0);
    const faturamentoTotal = pagos.reduce((s, o) => s + parseFloat(o.payment_subtotal || o.total || 0), 0);

    const ticketMedio = pagos.length > 0 ? faturamentoTotal / pagos.length : 0;


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
