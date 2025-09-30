import { NextResponse } from "next/server";

const API_URL = "https://elinorsilow.com/wp-json/wp/v2";

const authHeader = `Basic ${Buffer.from(
  `${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}`
).toString("base64")}`;

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  const uploadRes = await fetch(`${API_URL}/media`, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Disposition": `attachment; filename="${file.name}"`,
      "Content-Type": file.type,
    },
    body: file,
  });

  const data = await uploadRes.json();
  return NextResponse.json(data, { status: uploadRes.status });
}
