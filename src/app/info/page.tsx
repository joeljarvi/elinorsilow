import InfoPageClient from "./InfoPageClient";
import { getShortBio } from "../../../lib/sanity";

export default async function InfoPage() {
  const bio = await getShortBio();
  return <InfoPageClient bio={bio} />;
}
