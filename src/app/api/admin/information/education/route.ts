import { NextResponse } from "next/server";

const API_URL = "https://elinorsilow.com/wp-json/wp/v2";
const ACF_API_URL = API_URL.replace("/wp/v2", "") + "/acf/v3";
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

  // 1) Create post (title only)
  const createRes = await fetch(`${API_URL}/education`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify({
      title: body.title || body.acf?.title || "Untitled Education",
      status: "publish",
    }),
  });

  const createdPost = await createRes.json();
  if (!createRes.ok)
    return NextResponse.json(createdPost, { status: createRes.status });

  // 2) Update ACF fields
  if (body.acf) {
    await fetch(`${ACF_API_URL}/education/${createdPost.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ fields: body.acf }),
    });
  }

  return NextResponse.json(createdPost, { status: 200 });
}

// --- PUT ---
export async function PUT(req: Request) {
  const body = await req.json();
  const { id, acf, title } = body;

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // 1) Update post title
  const updateRes = await fetch(`${API_URL}/education/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify({
      title: title || acf?.title || "Untitled Education",
    }),
  });

  const updatedPost = await updateRes.json();
  if (!updateRes.ok)
    return NextResponse.json(updatedPost, { status: updateRes.status });

  // 2) Update ACF fields
  if (acf) {
    await fetch(`${ACF_API_URL}/education/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({ fields: acf }),
    });
  }

  return NextResponse.json(updatedPost, { status: 200 });
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
