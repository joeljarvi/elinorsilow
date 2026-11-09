import type { ReactNode } from "react";
import { connection } from "next/server";
import { getAllPress, getShortBio } from "../../../lib/sanity";
import IndexViews from "@/components/IndexViews";

// /works, /exhibitions and /info: one layout, which shows
// the view for the current URL. The pages themselves render nothing.
//
// Must not be prerendered: Next writes a static /index/… page to
// .next/server/app/index/index/….html, but Vercel looks for
// .next/server/app/index/….html, and the deploy fails with ENOENT.
// connection() renders it per request; the Sanity fetches stay cached (60s).
export default async function IndexLayout({
  children,
}: {
  children: ReactNode;
}) {
  await connection();
  const [bio, press] = await Promise.all([getShortBio(), getAllPress()]);
  return (
    <>
      <IndexViews bio={bio} press={press} />
      {children}
    </>
  );
}
