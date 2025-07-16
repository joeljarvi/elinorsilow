export interface Work {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  acf: {
    year: number;
    title: string;
    medium: string;
    dimensions: string;
    materials: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: [
      {
        source_url: string;
        alt_text: string;
        media_details?: {
          width?: number;
          height?: number;
        };
      }
    ];
  };
}

export type Exhibition = {
  id: number;
  title: { rendered: string };
  date: string;
  acf: {
    title: string;
    start_date: string;
    end_date: string;
    exhibition_type: string;
    venue: string;
    city: string;
    description?: string;
    credits?: string;
    image_1?: string;
    image_2?: string;
    image_3?: string;
    image_4?: string;
    image_5?: string;
    image_6?: string;
    image_7?: string;
    image_8?: string;
    image_9?: string;
    image_10?: string;
  };
};

const API_URL = "https://elinorsilow.com/wp-json/wp/v2";

export async function getAllWorks(): Promise<Work[]> {
  const res = await fetch(`${API_URL}/work?_embed&acf_format=standard`);
  return await res.json();
}

export async function getWorkBySlug(slug: string): Promise<Work | null> {
  const res = await fetch(
    `${API_URL}/work?slug=${slug}&_embed&acf_format=standard`,
    { next: { revalidate: 60 } }
  );
  const data = await res.json();
  return data.length ? data[0] : null;
}

export async function getAllExhibitions(): Promise<Exhibition[]> {
  const res = await fetch(`${API_URL}/exhibition?_embed&acf_format=standard`);
  return await res.json();
}

export async function getExhibitionBySlug(
  slug: string
): Promise<Exhibition | null> {
  const res = await fetch(
    `${API_URL}/exhibition?slug=${slug}&_embed&acf_format=standard`,
    { next: { revalidate: 60 } }
  );
  const data = await res.json();
  return data.length ? data[0] : null;
}
