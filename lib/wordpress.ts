export type Work = {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    year?: number | string;
    medium?: string;
    exhibition?: string;
    dimensions?: string;
    materials?: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: { id?: number; source_url?: string }[];
  };
  image_url?: string;
};

export type AcfImage = {
  id: number;
  url: string;
  alt?: string;
};

export type Exhibition = {
  id: number;
  slug: string;
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
    image_1?: AcfImage;
    image_2?: AcfImage;
    image_3?: AcfImage;
    image_4?: AcfImage;
    image_5?: AcfImage;
    image_6?: AcfImage;
    image_7?: AcfImage;
    image_8?: AcfImage;
    image_9?: AcfImage;
    image_10?: AcfImage;
    work_1?: string;
    work_2?: string;
    work_3?: string;
    work_4?: string;
    work_5?: string;
    work_6?: string;
    work_7?: string;
    work_8?: string;
    work_9?: string;
    work_10?: string;
  };
};

export type Education = {
  id: number;
  slug: string;
  title?: { rendered: string };
  acf: {
    school: string;
    start_year: string;
    end_year: string;
    city: string;
  };
};

export type Grant = {
  id: number;
  slug: string;
  title?: { rendered: string };
  acf: {
    title: string;
    year: string;
  };
};

export type Biography = {
  id: number;
  slug: string;
  title?: { rendered: string };
  acf: {
    bio: string;
  };
};

export type Exhibition_list = {
  id: number;
  slug: string;
  title: { rendered: string };
  date: string;
  acf: {
    year: string;
    exhibition_type: string;
    venue: string;
    city: string;
    description?: string;
  };
};

const API_URL = "https://elinorsilow.com/wp-json/wp/v2";

export async function getAllWorks(): Promise<Work[]> {
  const res = await fetch(
    `${API_URL}/work?_embed&acf_format=standard&per_page=100`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    console.error("Failed to fetch works:", res.status, res.statusText);
    return [];
  }

  const data = await res.json();

  return Array.isArray(data) ? data : [];
}
export async function getWorkBySlug(slug: string): Promise<Work | null> {
  const res = await fetch(
    `${API_URL}/work?slug=${slug}&_embed&acf_format=standard&per_page=100`,
    { next: { revalidate: 60 } }
  );
  const data = await res.json();
  return data.length ? data[0] : null;
}

export async function getAllExhibitions(): Promise<Exhibition[]> {
  const res = await fetch(
    `${API_URL}/exhibition?_embed&acf_format=standard&per_page=100`
  );
  return await res.json();
}

export async function getExhibitionBySlug(
  slug: string
): Promise<Exhibition | null> {
  const res = await fetch(
    `${API_URL}/exhibition?slug=${slug}&_embed&acf_format=standard&per_page=100`,
    { next: { revalidate: 60 } }
  );
  const data = await res.json();
  return data.length ? data[0] : null;
}

let cachedExhibitions: Exhibition[] | null = null;

export async function getCachedExhibitions(): Promise<Exhibition[]> {
  if (cachedExhibitions) return cachedExhibitions;

  const res = await fetch(
    `${API_URL}/exhibition?acf_format=standard&per_page=100`
  );
  if (!res.ok) return [];
  const data = await res.json();

  cachedExhibitions = Array.isArray(data) ? data : [];
  return cachedExhibitions;
}

let cachedWorks: Work[] | null = null;

export async function getCachedWorks(): Promise<Work[]> {
  if (cachedWorks) return cachedWorks;

  const res = await fetch(
    `${API_URL}/work?_embed&acf_format=standard&per_page=100`
  );
  if (!res.ok) return [];

  const data = await res.json();
  cachedWorks = Array.isArray(data) ? data : [];
  return cachedWorks;
}

export async function getAllEducations(): Promise<Education[]> {
  const res = await fetch(`${API_URL}/education?_embed&acf_format=standard`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error("Failed to fetch educations:", res.status, res.statusText);
    return [];
  }

  const data = await res.json();
  return Array.isArray(data)
    ? data.map((item, i) => ({
        ...item,
        id: item.id ?? i, // ensure an ID
      }))
    : [];
}

export async function getAllGrants(): Promise<Grant[]> {
  const res = await fetch(`${API_URL}/grant?_embed&acf_format=standard`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error("Failed to fetch grants:", res.status, res.statusText);
    return [];
  }

  const data = await res.json();
  return Array.isArray(data)
    ? data.map((item, i) => ({
        ...item,
        id: item.id ?? i,
      }))
    : [];
}

export async function getBiography(): Promise<Biography | null> {
  const res = await fetch(`${API_URL}/biography?_embed&acf_format=standard`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error("Failed to fetch biography:", res.status, res.statusText);
    return null;
  }

  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;

  const item = data[0];
  return { ...item, id: item.id ?? 0 };
}

export async function getExhibitionList(): Promise<Exhibition_list[]> {
  const res = await fetch(
    `${API_URL}/exhibition_list?_embed&acf_format=standard&per_page=100`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    console.error(
      "Failed to fetch exhibition list:",
      res.status,
      res.statusText
    );
    return [];
  }

  const data = await res.json();
  return Array.isArray(data)
    ? data.map((item, i) => ({
        ...item,
        id: item.id ?? i,
      }))
    : [];
}
