import {
  getLatestExhibition,
  getAllExhibitions,
  getRecentActivity,
  getNews,
  getShortBio,
  getAllPress,
  MediaItem,
  AcfImage,
} from "../../lib/sanity";
import HomeLayoutClient from "./HomeLayoutClient";

export default async function HomePageClient() {
  const [latestExhibition, allExhibitions, updates, news, bio, press] =
    await Promise.all([
      getLatestExhibition(),
      getAllExhibitions(),
      getRecentActivity(20),
      getNews(),
      // For the info view.
      getShortBio(),
      getAllPress(),
    ]);

  const acf = latestExhibition?.acf;
  const heroImages: AcfImage[] = acf
    ? ([
        acf.image_1,
        acf.image_2,
        acf.image_3,
        acf.image_4,
        acf.image_5,
        acf.image_6,
        acf.image_7,
        acf.image_8,
        acf.image_9,
        acf.image_10,
      ].filter(Boolean) as AcfImage[])
    : [];

  // The hero's exhibitions: one image (the first) per exhibition with its
  // metadata — the latest exhibition first, then the rest, newest year
  // first. The trumpet steps through them.
  const ordered = [
    ...(latestExhibition ? [latestExhibition] : []),
    ...allExhibitions.filter((ex) => ex.id !== latestExhibition?.id),
  ];
  const exhibitionMedia: MediaItem[] = ordered
    .filter((ex) => ex.acf.image_1?.url)
    .map((ex) => ({
      url: ex.acf.image_1!.url,
      title: ex.title.rendered,
      href: `/exhibitions/${ex.slug}`,
      meta: [ex.title.rendered, ex.acf.location, ex.acf.city, ex.acf.year]
        .filter((p) => p !== null && p !== undefined && p !== "")
        .map(String),
    }));

  return (
    <HomeLayoutClient
      heroImages={heroImages}
      heroTitle={latestExhibition?.title.rendered ?? ""}
      updates={updates}
      news={news}
      latestMedia={exhibitionMedia}
      bio={bio}
      press={press}
    />
  );
}
