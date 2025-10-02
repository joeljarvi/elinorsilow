// /app/api/admin/information/education/route.ts
import { NextResponse } from "next/server";

const API_URL = "https://elinorsilow.com/wp-json/wp/v2";
const authHeader = `Basic ${Buffer.from(
  `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`
).toString("base64")}`;

export async function POST(req: Request) {
  const body = await req.json();

  // WP requires "title". Use acf.title if no separate one.
  const payload = {
    title: body.title || body.acf?.title || "Untitled Education",
    acf: {
      title: body.acf?.title || "",
      start_year: body.acf?.start_year || "",
      end_year: body.acf?.end_year || "",
      city: body.acf?.city || "",
    },
  };

  console.log("Payload to WP:", payload);

  const res = await fetch(`${API_URL}/education`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log("Response from WP:", data);

  return NextResponse.json(data, { status: res.status });
}
