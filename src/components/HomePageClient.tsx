import { getShortBio } from "../../lib/sanity";
import HomeLayoutClient from "./HomeLayoutClient";

export default async function HomePageClient() {
  const bio = await getShortBio();
  return <HomeLayoutClient bio={bio} />;
}
