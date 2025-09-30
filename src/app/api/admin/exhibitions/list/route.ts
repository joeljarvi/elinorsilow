import { NextResponse } from "next/server";

const API_URL = "https://elinorsilow.com/wp-json/wp/v2";
const authHeader = `Basic ${Buffer.from(
  `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`
).toString("base64")}`;

export async function GET() {
  const res = await fetch(
    `${API_URL}/exhibition?_embed&acf_format=standard&per_page=100`,
    {
      headers: { Authorization: authHeader },
    }
  );

  if (!res.ok) return NextResponse.json([], { status: res.status });

  const data = await res.json();

  // Normalize first image URL for frontend if needed
  const normalized = data.map((ex: any) => ({
    ...ex,
    image_url: ex.acf?.image_1?.url || "", // fallback to first ACF image
  }));

  return NextResponse.json(normalized);
}
