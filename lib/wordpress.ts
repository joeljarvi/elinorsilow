export interface Work {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
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
      }
    ];
  };
}

export interface Exhibition {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  acf: {
    title?: string;
    duration?: string;
    exhibition_type?: string;
    location?: string;
    description?: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: [
      {
        source_url: string;
        alt_text: string;
      }
    ];
  };
}

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
