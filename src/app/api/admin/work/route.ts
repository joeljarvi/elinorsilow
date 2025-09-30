import { NextResponse } from "next/server";

const API_URL = "https://elinorsilow.com/wp-json/wp/v2";

const authHeader = `Basic ${Buffer.from(
  `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`
).toString("base64")}`;

// CREATE
export async function POST(req: Request) {
  const body = await req.json();

  // Create work
  const res = await fetch(`${API_URL}/work`, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: body.title, // WP post title
      status: "publish",
      acf: {
        year: parseInt(body.acf.year),
        medium: body.acf.medium,
        exhibition: body.acf.exhibition || "",
        dimensions: body.acf.dimensions || "",
        materials: body.acf.materials || "",
        image: body.featured_media, // optional duplicate in ACF
      },
      featured_media: body.featured_media, // WP featured image
    }),
  });

  const created = await res.json();

  // Fetch again with _embed so frontend gets the image URL
  const getRes = await fetch(`${API_URL}/work/${created.id}?_embed`, {
    headers: { Authorization: authHeader },
  });
  const data = await getRes.json();

  return NextResponse.json(data, { status: res.status });
}

// UPDATE
export async function PUT(req: Request) {
  const body = await req.json();

  const res = await fetch(`${API_URL}/work/${body.id}`, {
    method: "PUT",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: body.title, // WP post title
      status: "publish",
      acf: {
        year: parseInt(body.acf.year),
        medium: body.acf.medium,
        exhibition: body.acf.exhibition || "",
        dimensions: body.acf.dimensions || "",
        materials: body.acf.materials || "",
        image: body.featured_media, // optional duplicate in ACF
      },
      featured_media: body.featured_media, // WP featured image
    }),
  });

  const updated = await res.json();

  // Fetch again with _embed
  const getRes = await fetch(`${API_URL}/work/${updated.id}?_embed`, {
    headers: { Authorization: authHeader },
  });
  const json = await getRes.json(); // <-- this was missing

  const data = {
    ...json,
    image_url: json._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "",
  };

  return NextResponse.json(data, { status: res.status });
}

// DELETE
export async function DELETE(req: Request) {
  const body = await req.json();

  const res = await fetch(`${API_URL}/work/${body.id}?force=true`, {
    method: "DELETE",
    headers: {
      Authorization: authHeader,
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
