import { NextResponse } from "next/server";

const API_URL = "https://elinorsilow.com/wp-json/wp/v2";
const authHeader = `Basic ${Buffer.from(
  `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`
).toString("base64")}`;

// --- GET ---
export async function GET() {
  const res = await fetch(`${API_URL}/grants?per_page=100`, {
    headers: { Authorization: authHeader },
    cache: "no-store",
  });

  const data = await res.json();

  const withIds = Array.isArray(data)
    ? data.map((item, i) => ({ ...item, id: item.id ?? i }))
    : [];

  return NextResponse.json(withIds);
}

// --- POST ---
export async function POST(req: Request) {
  const payload = await req.json();

  const res = await fetch(`${API_URL}/grants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return NextResponse.json({ ...data, id: data.id }, { status: res.status });
}

// --- PUT ---
export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...payload } = body;

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const res = await fetch(`${API_URL}/grants/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return NextResponse.json({ ...data, id: data.id }, { status: res.status });
}

// --- DELETE ---
export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const res = await fetch(`${API_URL}/grants/${id}?force=true`, {
    method: "DELETE",
    headers: { Authorization: authHeader },
  });

  const data = await res.json();
  return NextResponse.json({ ...data, id }, { status: res.status });
}
