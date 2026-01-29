import { NextResponse } from "next/server";

const API_URL = "https://elinorsilow.com/wp-json/wp/v2";
const authHeader = `Basic ${Buffer.from(
  `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`
).toString("base64")}`;

// CREATE EXHIBITION
export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch(`${API_URL}/exhibition`, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: body.title,
      status: "publish",
      acf: {
        title: body.acf.title,
        start_date: body.acf.start_date,
        end_date: body.acf.end_date,
        exhibition_type: body.acf.exhibition_type,
        venue: body.acf.venue,
        city: body.acf.city,
        description: body.acf.description || "",
        credits: body.acf.credits || "",
        exhibitionBgColor: body.acf.exhibitionBgColor || "",
        image_1: body.acf.image_1 || null,
        image_2: body.acf.image_2 || null,
        image_3: body.acf.image_3 || null,
        image_4: body.acf.image_4 || null,
        image_5: body.acf.image_5 || null,
        image_6: body.acf.image_6 || null,
        image_7: body.acf.image_7 || null,
        image_8: body.acf.image_8 || null,
        image_9: body.acf.image_9 || null,
        image_10: body.acf.image_10 || null,
        work_1: body.acf.work_1 || "",
        work_2: body.acf.work_2 || "",
        work_3: body.acf.work_3 || "",
        work_4: body.acf.work_4 || "",
        work_5: body.acf.work_5 || "",
        work_6: body.acf.work_6 || "",
        work_7: body.acf.work_7 || "",
        work_8: body.acf.work_8 || "",
        work_9: body.acf.work_9 || "",
        work_10: body.acf.work_10 || "",
      },
    }),
  });

  const created = await res.json();

  // Fetch again with _embed for frontend usage
  const getRes = await fetch(`${API_URL}/exhibition/${created.id}?_embed`, {
    headers: { Authorization: authHeader },
  });
  const data = await getRes.json();

  return NextResponse.json(data, { status: res.status });
}

// UPDATE EXHIBITION
export async function PUT(req: Request) {
  const body = await req.json();

  const res = await fetch(`${API_URL}/exhibition/${body.id}`, {
    method: "PUT",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: body.title,
      status: "publish",
      acf: body.acf,
    }),
  });

  const updated = await res.json();

  // Fetch again with _embed
  const getRes = await fetch(`${API_URL}/exhibition/${updated.id}?_embed`, {
    headers: { Authorization: authHeader },
  });
  const data = await getRes.json();

  return NextResponse.json(data, { status: res.status });
}

// DELETE EXHIBITION
export async function DELETE(req: Request) {
  const body = await req.json();

  const res = await fetch(`${API_URL}/exhibition/${body.id}?force=true`, {
    method: "DELETE",
    headers: {
      Authorization: authHeader,
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
