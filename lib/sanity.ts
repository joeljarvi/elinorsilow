import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const client = createClient({
  projectId: "nk8tddh2",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ---- Types (same shape as the WordPress types used throughout the app) ----

export type Work = {
  id: string;
  slug: string;
  title: { rendered: string };
  acf: {
    year: number;
    category: string;
    exhibition?: string;
    dimensions: string;
    materials: string;
  };
  image_url?: string;
  featured?: boolean;
};

export type AcfImage = {
  id: number | string;
  url: string;
  alt?: string;
  caption?: string;
  description?: string;
  width?: number;
  height?: number;
};

export type Exhibition = {
  id: string;
  slug: string;
  title: { rendered: string };
  date: string;
  acf: {
    title: string;
    year: string;
    exhibition_type: string;
    location: string;
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
  featured?: boolean;
};

export type Education = {
  id: string;
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
  id: string;
  slug: string;
  title?: { rendered: string };
  acf: {
    title: string;
    year: string;
  };
};

export type Biography = {
  id: string;
  slug: string;
  title?: { rendered: string };
  acf: {
    bio: string;
  };
};

export type Exhibition_list = {
  id: string;
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

export type CombinedExhibition = Exhibition | Exhibition_list;

// ---- Transform functions ----

function transformWork(doc: any): Work {
  let image_url: string | undefined;
  try {
    image_url = doc.image?.asset ? urlFor(doc.image).url() : undefined;
  } catch {
    image_url = undefined;
  }
  return {
    id: doc._id,
    slug: doc.slug,
    title: { rendered: doc.title },
    acf: {
      year: doc.year,
      category: doc.category?.toLowerCase() || "",
      exhibition: doc.exhibition,
      dimensions: doc.dimensions || "",
      materials: doc.materials || "",
    },
    image_url,
    featured: doc.featured ?? false,
  };
}

function transformExhibition(doc: any): Exhibition {
  const images: Record<string, AcfImage> = {};
  if (Array.isArray(doc.images)) {
    doc.images.slice(0, 10).forEach((img: any, i: number) => {
      images[`image_${i + 1}`] = {
        id: i,
        url: img.url || "",
        alt: img.alt || "",
        caption: img.caption || "",
        description: img.description || "",
        width: img.width,
        height: img.height,
      };
    });
  }

  const works: Record<string, string> = {};
  if (Array.isArray(doc.related_works)) {
    doc.related_works.slice(0, 10).forEach((w: string, i: number) => {
      works[`work_${i + 1}`] = w;
    });
  }

  return {
    id: doc._id,
    slug: doc.slug,
    title: { rendered: doc.title },
    date: doc._createdAt || "",
    acf: {
      title: doc.title,
      year: doc.year || "",
      exhibition_type: doc.exhibition_type || "",
      location: doc.location || "",
      city: doc.city || "",
      description: doc.description,
      credits: doc.credits,
      ...images,
      ...works,
    },
    featured: doc.featured ?? false,
  };
}

function transformExhibitionList(doc: any): Exhibition_list {
  return {
    id: doc._id,
    slug: doc.slug,
    title: { rendered: doc.title },
    date: doc._createdAt || "",
    acf: {
      year: doc.year || "",
      exhibition_type: doc.exhibition_type || "",
      venue: doc.venue || "",
      city: doc.city || "",
      description: doc.description,
    },
  };
}

// ---- In-memory cache ----

let cachedWorks: Work[] | null = null;
let cachedExhibitions: Exhibition[] | null = null;

// ---- Fetch functions ----

const WORK_FIELDS = `
  _id, "slug": slug.current, title, year, category,
  materials, dimensions, exhibition, description, image, featured
`;

const EXHIBITION_FIELDS = `
  _id, "slug": slug.current, title, year, exhibition_type,
  location, city, description, credits, related_works, featured, _createdAt,
  "images": images[]{
    alt, caption, description,
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  }
`;

export async function getAllWorks(): Promise<Work[]> {
  const data = await client.fetch(
    `*[_type == "work"] | order(year desc) { ${WORK_FIELDS} }`,
    {},
    { next: { revalidate: 60 } }
  );
  return Array.isArray(data) ? data.map(transformWork) : [];
}

export async function getWorkBySlug(slug: string): Promise<Work | null> {
  const data = await client.fetch(
    `*[_type == "work" && slug.current == $slug][0] { ${WORK_FIELDS} }`,
    { slug },
    { next: { revalidate: 60 } }
  );
  return data ? transformWork(data) : null;
}

export async function getAllExhibitions(): Promise<Exhibition[]> {
  const data = await client.fetch(
    `*[_type == "exhibition"] | order(year desc) { ${EXHIBITION_FIELDS} }`
  );
  return Array.isArray(data) ? data.map(transformExhibition) : [];
}

export async function getExhibitionBySlug(
  slug: string
): Promise<Exhibition | null> {
  const data = await client.fetch(
    `*[_type == "exhibition" && slug.current == $slug][0] { ${EXHIBITION_FIELDS} }`,
    { slug },
    { next: { revalidate: 60 } }
  );
  return data ? transformExhibition(data) : null;
}

export async function getCachedExhibitions(): Promise<Exhibition[]> {
  if (cachedExhibitions) return cachedExhibitions;
  cachedExhibitions = await getAllExhibitions();
  return cachedExhibitions;
}

export async function getCachedWorks(): Promise<Work[]> {
  if (cachedWorks) return cachedWorks;
  cachedWorks = await getAllWorks();
  return cachedWorks;
}

export async function getAllEducations(): Promise<Education[]> {
  const data = await client.fetch(
    `*[_type == "education"] | order(start_year desc) {
      _id, "slug": slug.current, school, start_year, end_year, city
    }`,
    {},
    { next: { revalidate: 60 } }
  );
  return Array.isArray(data)
    ? data.map((doc: any) => ({
        id: doc._id,
        slug: doc.slug || "",
        acf: {
          school: doc.school || "",
          start_year: String(doc.start_year || ""),
          end_year: String(doc.end_year || ""),
          city: doc.city || "",
        },
      }))
    : [];
}

export async function getAllGrants(): Promise<Grant[]> {
  const data = await client.fetch(
    `*[_type == "grant"] | order(year desc) {
      _id, "slug": slug.current, title, year
    }`,
    {},
    { next: { revalidate: 60 } }
  );
  return Array.isArray(data)
    ? data.map((doc: any) => ({
        id: doc._id,
        slug: doc.slug || "",
        acf: {
          title: doc.title || "",
          year: String(doc.year || ""),
        },
      }))
    : [];
}

export async function getExhibitionList(): Promise<Exhibition_list[]> {
  const data = await client.fetch(
    `*[_type == "exhibition_list"] | order(year desc) {
      _id, "slug": slug.current, title, year, exhibition_type, venue, city, description, _createdAt
    }`,
    {},
    { next: { revalidate: 60 } }
  );
  return Array.isArray(data) ? data.map(transformExhibitionList) : [];
}
