import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const { data, error } = await supabase
    .from("criativos")
    .insert([{ ...body, tipo: "imagem", ctr: "", cpa: "", roas: "", status: "ativo" }])
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const supabase = await createClient();
  const { error } = await supabase.from("criativos").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
