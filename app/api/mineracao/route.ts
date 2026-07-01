import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get("pageId");
  const token = searchParams.get("token");
  const resolveSlug = searchParams.get("resolveSlug");

  if (!token) return NextResponse.json({ error: "Token não informado" }, { status: 400 });

  // Resolver slug para page ID
  if (resolveSlug) {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/${resolveSlug}?fields=id,name,fan_count&access_token=${token}`
    );
    const data = await res.json();
    return NextResponse.json(data);
  }

  if (!pageId) return NextResponse.json({ error: "pageId não informado" }, { status: 400 });

  // Buscar todos os anúncios da página (ativos e inativos) na UE
  const params = new URLSearchParams({
    access_token: token,
    search_page_ids: pageId,
    ad_reached_countries: '["DE","FR","ES","IT","NL","PT","PL","SE","BE","AT"]',
    ad_type: "ALL",
    ad_active_status: "ALL",
    fields: "id,ad_creation_time,ad_delivery_start_time,ad_delivery_stop_time,ad_creative_bodies,ad_creative_link_titles,publisher_platforms,page_name",
    limit: "500",
  });

  const res = await fetch(`https://graph.facebook.com/v19.0/ads_archive?${params}`);
  const data = await res.json();

  if (data.error) return NextResponse.json({ error: data.error.message }, { status: 400 });

  return NextResponse.json({ ads: data.data || [], total: (data.data || []).length });
}
