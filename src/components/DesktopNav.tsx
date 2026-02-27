"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  type Variants,
} from "framer-motion";
import { Button } from "./ui/button";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

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

const navContainer: Variants = {
  hidden: {
    opacity: 0,
    transition: { staggerChildren: 0.06, staggerDirection: -1 },
  },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const navItemVariant: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
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
    allExhibitionsMap.set(ex.title.rendered, { ...ex, __type: "exhibition" }),
  );

  exhibitionList.forEach((ex) => {
    if (!allExhibitionsMap.has(ex.title.rendered)) {
      allExhibitionsMap.set(ex.title.rendered, { ...ex, __type: "list" });
    }
  });

  return (
    <div className="z-30 fixed lg:absolute lg:z-auto  top-0 left-0      w-full flex flex-col items-start justify-start gap-y-4 bg-transparent  ">
      <AnimatePresence>
        {open && (
          <motion.div
            key="desktop-nav"
            animate={{ x: hidden ? "-150%" : "0%" }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          >
            <motion.nav
              variants={navContainer}
              initial="hidden"
              animate="visible"
              className=" pt-8 pl-8 pr-8 pb-8 lg:pt-8 lg:pl-40  lg:pr-64 flex flex-wrap gap-y-4 lg:gap-y-2 gap-x-0 lg:gap-x-2 no-hide-text  text-3xl lg:text-3xl font-directorLight items-baseline  max-w-full lg:max-w-6xl"
            >
              <motion.span variants={navItemVariant}>
                <NavItem href="/" active={pathname === "/"}>
                  Elinor Silow
                </NavItem>
              </motion.span>
              ,
              <motion.span variants={navItemVariant}>
                <NavItem
                  href="/works"
                  className="ml-2 lg:ml-2"
                  active={pathname.startsWith("/works")}
                >
                  Works
                </NavItem>
              </motion.span>
              ,
              <motion.span variants={navItemVariant}>
                <NavItem
                  href="/exhibitions"
                  className="ml-2 lg:ml-2"
                  active={pathname.startsWith("/exhibitions")}
                >
                  Exhibitions
                </NavItem>
              </motion.span>
              ,
              <motion.span variants={navItemVariant}>
                <NavItem
                  href="/info"
                  className="ml-2 lg:ml-0"
                  active={pathname.startsWith("/info")}
                >
                  Info
                </NavItem>
              </motion.span>
              ,
              <motion.span variants={navItemVariant}>
                <Button
                  asChild
                  variant="link"
                  size="linkSizeLg"
                  className="ml-0 lg:ml-2"
                >
                  <Link href="/">Contact</Link>
                </Button>
              </motion.span>
              ,
              <motion.span variants={navItemVariant}>
                <AnimatePresence>
                  {openSearch ? (
                    <motion.div
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="ml-2"
                    >
                      <NavSearch onClose={() => setOpenSearch(false)} />
                    </motion.div>
                  ) : (
                    <Button
                      variant="link"
                      size="linkSizeLg"
                      className="ml-2  "
                      onClick={() => {
                        setOpenSearch(true);
                        setOpenBio(false);
                      }}
                    >
                      Search...
                    </Button>
                  )}
                </AnimatePresence>
              </motion.span>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
