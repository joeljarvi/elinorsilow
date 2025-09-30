import { NextResponse } from "next/server";
import { Work } from "../../../../../../lib/wordpress";

const API_URL = "https://elinorsilow.com/wp-json/wp/v2";

const authHeader = `Basic ${Buffer.from(
  `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`
).toString("base64")}`;

export async function GET() {
  const res = await fetch(
    `${API_URL}/work?_embed&acf_format=standard&per_page=100`,
    {
      headers: {
        Authorization: authHeader,
      },
    }
  );

  if (!res.ok) return NextResponse.json([], { status: res.status });

  const data: Work[] = await res.json();

  // Normalize image_url for frontend
  const normalized = data.map((work) => ({
    ...work,
    image_url: work._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
  }));

  return NextResponse.json(normalized);
}
