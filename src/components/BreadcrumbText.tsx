import { usePathname } from "next/navigation";
import Link from "next/link";
import { Exhibition, Work } from "../../lib/wordpress";

function BreadcrumbText({
  work,
  currentExhibition,
}: {
  work?: Work;
  currentExhibition?: Exhibition;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  let breadcrumb: React.ReactNode = null;

  // Homepage = Works
  if (pathname === "/") {
    breadcrumb = <>Works</>;
  }

  // Exhibitions index
  else if (pathname === "/exhibitions") {
    breadcrumb = <>Exhibitions</>;
  }

  // Exhibition slug page
  else if (segments[0] === "exhibitions" && segments[1]) {
    breadcrumb = (
      <>
        <Link href="/exhibitions" className="hover:underline">
          Exhibitions
        </Link>{" "}
        / {currentExhibition?.title?.rendered || "Untitled"}{" "}
      </>
    );
  }

  return (
    <div className="text-lg font-sans fixed top-12 left-6 z-20 px-5 py-6  uppercase ">
      {breadcrumb}
    </div>
  );
}

export default BreadcrumbText;
