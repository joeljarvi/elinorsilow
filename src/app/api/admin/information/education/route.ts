import { NextResponse } from "next/server";

const API_URL = "https://elinorsilow.com/wp-json/wp/v2";
const authHeader = `Basic ${Buffer.from(
  `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`
).toString("base64")}`;

export async function GET() {
  const res = await fetch(`${API_URL}/education?per_page=100`, {
    headers: { Authorization: authHeader },
    cache: "no-store",
  });

  const data = await res.json();

  const withIds = Array.isArray(data)
    ? data.map((item, i) => ({ ...item, id: item.id ?? i }))
    : [];

  return NextResponse.json(withIds, { status: res.status });
}

export async function POST(req: Request) {
  const body = await req.json();

  const payload = {
    title: "Education Post Title",
    acf: {
      title: "Education ACF Title",
      start_year: "2020",
      end_year: "2022",
      city: "Stockholm",
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

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...rest } = body;

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const payload = {
    title: rest.title || rest.acf?.title || "Untitled Education",
    acf: rest.acf,
  };

  const res = await fetch(`${API_URL}/education/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// --- DELETE ---
export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const res = await fetch(`${API_URL}/education/${id}?force=true`, {
    method: "DELETE",
    headers: { Authorization: authHeader },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
