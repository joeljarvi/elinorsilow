import { NextResponse } from "next/server";

const API_URL = "https://elinorsilow.com/wp-json/wp/v2";
const authHeader = `Basic ${Buffer.from(
  `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`
).toString("base64")}`;

// --- GET: Fetch all educations ---
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

// --- POST: Create new education ---
export async function POST(req: Request) {
  const body = await req.json();
  const { school, start_year, end_year, city } = body;

  const payload = {
    title: school || "Untitled Education",
    acf: { school, start_year, end_year, city },
  };

  const res = await fetch(`${API_URL}/education`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

// --- PUT: Update existing education ---
export async function PUT(req: Request) {
  const body = await req.json();
  const { id, school, start_year, end_year, city } = body;

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const payload = {
    title: school || "Untitled Education",
    acf: { school, start_year, end_year, city },
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

// --- DELETE: Remove education ---
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
