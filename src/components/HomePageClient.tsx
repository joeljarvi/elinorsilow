import { getFeaturedWorks, getLatestWorks } from "../../lib/sanity";
import HomeLayoutClient from "./HomeLayoutClient";

export default async function HomePageClient() {
  // A random one of the works marked "Featured on home page" (picked each
  // time the page regenerates); if none are, the latest work.
  const featured = await getFeaturedWorks();
  const works = featured.length ? featured : await getLatestWorks(1);
  const work = works[Math.floor(Math.random() * works.length)] ?? null;
  return <HomeLayoutClient work={work} />;
}
