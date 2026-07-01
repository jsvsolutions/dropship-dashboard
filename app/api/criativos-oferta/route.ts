import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function mapRow(row: any) {
  return {
    id: row.id,
    titulo: row.titulo,
    copy: row.copy,
    plataforma: row.plataforma,
    url: row.url,
    observacao: row.ctr || "",
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ofertaId = searchParams.get("ofertaId");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("criativos")
    .select("*")
    .eq("produto", ofertaId)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data || []).map(mapRow));
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { titulo, copy, plataforma, produto, url, observacao } = await request.json();
  const { data, error } = await supabase
    .from("criativos")
    .insert([{ titulo, copy, plataforma, produto, url, tipo: "imagem", ctr: observacao || "", cpa: "", roas: "", status: "ativo" }])
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(mapRow(data));
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { id, titulo, copy, plataforma, url, observacao } = await request.json();
  const { data, error } = await supabase
    .from("criativos")
    .update({ titulo, copy, plataforma, url, ctr: observacao || "" })
    .eq("id", id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(mapRow(data));
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const supabase = await createClient();
  const { error } = await supabase.from("criativos").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
