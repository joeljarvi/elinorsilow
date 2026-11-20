import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

export const client = createClient({
  projectId: "nk8tddh2",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});

const builder = createImageUrlBuilder(client);

// A Sanity image's URL builder (works' image_url).
function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ---- Types (same shape as the WordPress types used throughout the app) ----

export type Work = {
  id: string;
  slug: string;
  title: { rendered: string };
  date: string;
  acf: {
    year: number;
    category: string;
    exhibition?: string;
    status?: string;
    dimensions: string;
    materials: string;
  };
  image_url?: string;
  featured?: boolean;
  // The position set by dragging in the Studio's Works list (a sortable
  // string; unset until the list has been ordered).
  orderRank?: string;
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
    // Optional, "YYYY-MM-DD".
    start_date?: string;
    end_date?: string;
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
  // Every image, in order — as many as the exhibition has.
  images: AcfImage[];
  featured?: boolean;
  upcoming?: boolean;
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
  // When it was added to the CMS (_createdAt).
  date: string;
  title?: { rendered: string };
  acf: {
    title: string;
    institution?: string;
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

export type Press = {
  id: string;
  // When it was added to the CMS (_createdAt).
  date: string;
  title: string;
  author: string;
  link: string;
  year: string;
};

export type NewsItem = {
  date?: string; // YYYY-MM-DD
  name?: string;
  link?: string;
  location?: string;
};

export type LongBio = {
  bio: string;
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
    // Optional, "YYYY-MM-DD".
    start_date?: string;
    end_date?: string;
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
    title: { rendered: (doc.title || "").normalize("NFC") },
    date: doc._createdAt || "",
    acf: {
      year: doc.year,
      category: doc.category?.toLowerCase() || "",
      exhibition: doc.exhibition,
      status: doc.status,
      dimensions: doc.dimensions || "",
      materials: doc.materials || "",
    },
    image_url,
    featured: doc.featured ?? false,
    orderRank: doc.orderRank || undefined,
  };
}

function transformExhibition(doc: any): Exhibition {
  // Every image (no limit), skipping any without a file.
  const images: AcfImage[] = Array.isArray(doc.images)
    ? doc.images
        .filter((img: any) => img?.url)
        .map((img: any, i: number) => ({
          id: i,
          url: img.url,
          alt: img.alt || "",
          caption: img.caption || "",
          description: img.description || "",
          width: img.width,
          height: img.height,
        }))
    : [];

  const works: Record<string, string> = {};
  if (Array.isArray(doc.related_works)) {
    doc.related_works.slice(0, 10).forEach((w: string, i: number) => {
      works[`work_${i + 1}`] = w;
    });
  }

  const title = (doc.title || "").normalize("NFC");
  return {
    id: doc._id,
    slug: doc.slug,
    title: { rendered: title },
    date: doc._createdAt || "",
    acf: {
      title,
      year: doc.year || "",
      exhibition_type: doc.exhibition_type || "",
      location: doc.location || "",
      city: doc.city || "",
      description: doc.description,
      credits: doc.credits,
      start_date: doc.start_date || undefined,
      end_date: doc.end_date || undefined,
      ...works,
    },
    images,
    featured: doc.featured ?? false,
    upcoming: doc.upcoming ?? false,
  };
}

function transformExhibitionList(doc: any): Exhibition_list {
  return {
    id: doc._id,
    slug: doc.slug,
    title: { rendered: (doc.title || "").normalize("NFC") },
    date: doc._createdAt || "",
    acf: {
      year: doc.year || "",
      exhibition_type: doc.exhibition_type || "",
      venue: doc.venue || "",
      city: doc.city || "",
      description: doc.description,
      start_date: doc.start_date || undefined,
      end_date: doc.end_date || undefined,
    },
  };
}

// ---- Fetch functions ----

const WORK_FIELDS = `
  _id, "slug": slug.current, title, year, category,
  materials, dimensions, exhibition, status, description, image, featured, orderRank, _createdAt
`;

const EXHIBITION_FIELDS = `
  _id, "slug": slug.current, title, year, exhibition_type,
  location, city, description, credits, start_date, end_date, related_works, featured, upcoming, _createdAt,
  "images": images[]{
    alt, caption, description,
    "url": asset->url,
    "width": asset->metadata.dimensions.width,
    "height": asset->metadata.dimensions.height
  }
`;

export async function getAllWorks(): Promise<Work[]> {
  const data = await client.fetch(
    // Hidden works (hidden == true) stay in the CMS, off the site.
    `*[_type == "work" && hidden != true] | order(year desc) { ${WORK_FIELDS} }`,
    {},
    { next: { revalidate: 60 } }
  );
  return Array.isArray(data) ? data.map(transformWork) : [];
}

export async function getWorkBySlug(slug: string): Promise<Work | null> {
  const data = await client.fetch(
    `*[_type == "work" && hidden != true && slug.current == $slug][0] { ${WORK_FIELDS} }`,
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
      _id, "slug": slug.current, title, institution, year, _createdAt
    }`,
    {},
    { next: { revalidate: 60 } }
  );
  return Array.isArray(data)
    ? data.map((doc: any) => ({
        id: doc._id,
        slug: doc.slug || "",
        date: doc._createdAt || "",
        acf: {
          title: (doc.title || "").normalize("NFC"),
          institution: doc.institution
            ? String(doc.institution).normalize("NFC")
            : undefined,
          year: String(doc.year || ""),
        },
      }))
    : [];
}

export async function getAllPress(): Promise<Press[]> {
  const data = await client.fetch(
    `*[_type == "press"] | order(year asc) { _id, title, author, link, year, _createdAt }`,
    {},
    { next: { revalidate: 60 } }
  );
  return Array.isArray(data)
    ? data.map((doc: any) => ({
        id: doc._id,
        date: doc._createdAt || "",
        title: (doc.title || "").normalize("NFC"),
        author: (doc.author || "").normalize("NFC"),
        link: doc.link || "",
        year: String(doc.year || ""),
      }))
    : [];
}

export async function getShortBio(): Promise<string> {
  const data = await client.fetch(
    `*[_type == "short_bio"][0] { bio }`,
    {},
    { next: { revalidate: 60 } }
  );
  return data?.bio ?? "";
}

export async function getLongBio(): Promise<string> {
  const data = await client.fetch(
    `*[_type == "long_bio"][0] { bio }`,
    {},
    { next: { revalidate: 60 } }
  );
  return data?.bio ?? "";
}

export async function getExhibitionList(): Promise<Exhibition_list[]> {
  const data = await client.fetch(
    `*[_type == "exhibition_list"] | order(year desc) {
      _id, "slug": slug.current, title, year, exhibition_type, venue, city, description, start_date, end_date, _createdAt
    }`,
    {},
    { next: { revalidate: 60 } }
  );
  return Array.isArray(data) ? data.map(transformExhibitionList) : [];
}
