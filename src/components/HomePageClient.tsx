import { getFeaturedWorks, getRecentActivity } from "../../lib/sanity";
import HomeLayoutClient from "./HomeLayoutClient";

export default async function HomePageClient() {
  const [featuredWorks, updates] = await Promise.all([
    getFeaturedWorks(),
    getRecentActivity(20),
  ]);
  return <HomeLayoutClient recentWorks={featuredWorks} updates={updates} />;
}
