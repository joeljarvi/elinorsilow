import { NextResponse } from "next/server";

const API_URL = "https://elinorsilow.com/wp-json/wp/v2";
const authHeader = `Basic ${Buffer.from(
  `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`
).toString("base64")}`;

// --- GET ---
export async function GET() {
  try {
    const res = await fetch(`${API_URL}/biography?per_page=1`, {
      headers: { Authorization: authHeader },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch biography: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const bio = Array.isArray(data) ? data[0] : data;

    return NextResponse.json({
      ...bio,
      id: bio?.id ?? 0,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
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
    return NextResponse.json(data, { status: res.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// --- PUT ---
export async function PUT(req: Request) {
  try {
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
    return NextResponse.json(data, { status: res.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// --- DELETE ---
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const res = await fetch(`${API_URL}/biography/${id}?force=true`, {
      method: "DELETE",
      headers: { Authorization: authHeader },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
