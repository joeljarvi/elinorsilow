import { getHeroImages, getShortBio } from "../../lib/sanity";
import HomeLayoutClient from "./HomeLayoutClient";

export default async function HomePageClient() {
  const [bio, heroImages] = await Promise.all([getShortBio(), getHeroImages()]);
  // One of the Hero images, picked at random each time the page regenerates.
  const hero =
    heroImages[Math.floor(Math.random() * heroImages.length)] ?? null;
  return <HomeLayoutClient bio={bio} hero={hero} />;
}
