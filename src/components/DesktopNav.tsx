"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Button } from "./ui/button";

import { useRouter } from "next/navigation";

import { useUI } from "@/context/UIContext";
import { useWorks } from "@/context/WorksContext";
import { useExhibitions } from "@/context/ExhibitionsContext";
import { useInfo } from "@/context/InfoContext";
import { usePathname } from "next/navigation";

import NavSearch from "./NavSearch";

type ExhibitionItem = {
  id: number;
  title: { rendered: string };
  slug?: string;
  __type: "exhibition";
};

type ExhibitionListItem = {
  id: number;
  title: { rendered: string };
  __type: "list";
};

function NavItem({
  href,
  active,
  children,
  className = "",
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Button
      variant="link"
      size="linkSizeLg"
      className={`
   ${className}
      underline-offset-8
      decoration-[0.5px]
      ${active ? "underline" : "no-underline"}
      `}
      asChild
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
}

export default function DesktopNav() {
  const [openSearch, setOpenSearch] = useState(false);

  const { scrollY } = useScroll();
  const pathname = usePathname();

  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    if (y > lastY && y > 100) {
      setHidden(true); // scrolling down
    } else {
      setHidden(false); // scrolling up
    }

    setLastY(y);
  });

  const { exhibitions } = useExhibitions();

  const { exhibitionList } = useInfo();
  const [openBio, setOpenBio] = useState(false);
  const { open, setOpen, handleOpen } = useUI();

  const {} = useUI();

  const router = useRouter();

  const allExhibitionsMap = new Map<
    string,
    ExhibitionItem | ExhibitionListItem
  >();

  exhibitions.forEach((ex) =>
    allExhibitionsMap.set(ex.title.rendered, { ...ex, __type: "exhibition" })
  );

  exhibitionList.forEach((ex) => {
    if (!allExhibitionsMap.has(ex.title.rendered)) {
      allExhibitionsMap.set(ex.title.rendered, { ...ex, __type: "list" });
    }
  });

  return (
    <div className="z-0 absolute lg:fixed top-0 left-0      w-full flex flex-col items-start justify-start gap-y-4   ">
      {open && (
        <motion.nav
          initial={{ y: 0 }}
          animate={{ y: hidden ? "-150%" : "0%" }}
          transition={{
            duration: 0.4,
            ease: [0.25, 1, 0.5, 1],
          }}
          className=" pt-4 pl-4 pr-4 pb-4 lg:pt-8 lg:pl-40  lg:pr-64 flex flex-wrap gap-y-4 lg:gap-y-2 gap-x-0 lg:gap-x-2 no-hide-text  text-3xl lg:text-5xl font-directorLight items-baseline bg-background"
        >
          <NavItem href="/" active={pathname === "/"}>
            Elinor Silow
          </NavItem>
          ,
          <NavItem
            href="/works"
            className="ml-2"
            active={pathname.startsWith("/works")}
          >
            Works
          </NavItem>
          ,
          <NavItem
            href="/exhibitions"
            className="ml-0 lg:ml-2"
            active={pathname.startsWith("/exhibitions")}
          >
            Exhibitions
          </NavItem>
          ,
          <NavItem
            href="/info"
            className="ml-2"
            active={pathname.startsWith("/info")}
          >
            Info
          </NavItem>
          ,
          <Button
            asChild
            variant="link"
            size="linkSizeLg"
            className="ml-0 lg:ml-2"
          >
            <Link href="/">Contact</Link>
          </Button>
          ,
          <AnimatePresence>
            {openSearch ? (
              <motion.div
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className=""
              >
                <NavSearch />
              </motion.div>
            ) : (
              <Button
                variant="link"
                size="linkSizeLg"
                className="ml-2"
                onClick={() => {
                  setOpenSearch(true);
                  setOpenBio(false);
                }}
              >
                Search
              </Button>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </div>
  );
}
