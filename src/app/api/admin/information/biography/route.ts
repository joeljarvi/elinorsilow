import { NextResponse } from "next/server";

const API_URL = "https://elinorsilow.com/wp-json/wp/v2";
const authHeader = `Basic ${Buffer.from(
  `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`
).toString("base64")}`;

// --- GET ---
export async function GET() {
  const res = await fetch(`${API_URL}/biography?per_page=1`, {
    headers: { Authorization: authHeader },
    cache: "no-store",
  });

  const data = await res.json();
  const bio = Array.isArray(data) ? data[0] : data;

  return NextResponse.json({ ...bio, id: bio?.id ?? "bio" });
}

// --- POST (usually only one bio, optional) ---
export async function POST(req: Request) {
  const payload = await req.json();

  const res = await fetch(`${API_URL}/biography`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return NextResponse.json(
    { ...data, id: data.id ?? "bio" },
    { status: res.status }
  );
}

// --- PUT ---
export async function PUT(req: Request) {
  const body = await req.json();
  const { id, ...payload } = body;

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const res = await fetch(`${API_URL}/biography/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return NextResponse.json(
    { ...data, id: data.id ?? "bio" },
    { status: res.status }
  );
}

// --- DELETE ---
export async function DELETE(req: Request) {
  const body = await req.json();
  const { id } = body;

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const res = await fetch(`${API_URL}/biography/${id}?force=true`, {
    method: "DELETE",
    headers: { Authorization: authHeader },
  });

  const data = await res.json();
  return NextResponse.json(
    { ...data, id: data.id ?? "bio" },
    { status: res.status }
  );
}
