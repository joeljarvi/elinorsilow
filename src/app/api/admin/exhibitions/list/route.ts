import { NextResponse } from "next/server";
import { Exhibition } from "../../../../../../lib/wordpress";

const API_URL = "https://elinorsilow.com/wp-json/wp/v2";
const authHeader = `Basic ${Buffer.from(
  `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`
).toString("base64")}`;

export async function GET() {
  const res = await fetch(
    `${API_URL}/exhibition?_embed&acf_format=standard&per_page=100`,
    {
      headers: { Authorization: authHeader },
      next: { revalidate: 60 }, // optional: cache 1 min
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch exhibitions:", res.statusText);
    return NextResponse.json([], { status: res.status });
  }

  const data: Exhibition[] = await res.json();

  const normalized = data.map((ex) => ({
    ...ex,
    image_url: ex.acf?.image_1?.url || "", // fallback to first ACF image
  }));

  return NextResponse.json(normalized);
}
