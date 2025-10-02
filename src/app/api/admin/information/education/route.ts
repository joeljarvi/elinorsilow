import { NextResponse } from "next/server";

const API_URL = "https://elinorsilow.com/wp-json/wp/v2";
const ACF_API = "https://elinorsilow.com/wp-json/acf/v3";
const authHeader = `Basic ${Buffer.from(
  `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`
).toString("base64")}`;

// --- GET ---
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

// --- POST ---
export async function POST(req: Request) {
  const body = await req.json();
  const { school, start_year, end_year, city } = body;

  // Step 1: Create WP post (required title)
  const postRes = await fetch(`${API_URL}/education`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify({ title: school || "Education" }),
  });
  const postData = await postRes.json();

  if (!postRes.ok) {
    return NextResponse.json(postData, { status: postRes.status });
  }

  // Step 2: Update ACF fields
  const acfRes = await fetch(`${ACF_API}/education/${postData.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify({
      fields: { school, start_year, end_year, city },
    }),
  });
  const acfData = await acfRes.json();

  return NextResponse.json(acfData, { status: acfRes.status });
}

// --- PUT ---
export async function PUT(req: Request) {
  const body = await req.json();
  const { id, school, start_year, end_year, city } = body;

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // Step 1: Update WP post title
  await fetch(`${API_URL}/education/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify({ title: school || "Education" }),
  });

  // Step 2: Update ACF fields
  const acfRes = await fetch(`${ACF_API}/education/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify({ fields: { school, start_year, end_year, city } }),
  });

  const acfData = await acfRes.json();
  return NextResponse.json(acfData, { status: acfRes.status });
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
