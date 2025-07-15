"use client";

import { Header } from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function HomePage() {
  const [openTools, setOpenTools] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <>
      <Header
        showSettings={false}
        openTools={openTools}
        setOpenTools={setOpenTools}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        titleState="home"
      />

      <div className="w-screen h-screen font-serif flex flex-col items-start justify-center ">
        <div className="grid grid-cols-2 w-full h-full">
          <div className="col-span-2 lg:col-span-1 flex flex-col items-start justify-center  gap-y-6 p-6">
            <Image
              src="/elli_trumpetgubbe.jpg"
              alt="drawing by Elinor Silow"
              width={1713}
              height={2697}
              loading="lazy"
              className="max-w-1/3  object-cover"
            />
            <div className="flex flex-col items-start justify-center w-full lg:max-w-2/3">
              <Link href="/" className="font-serif-italic opacity-30">
                /info
              </Link>
              <p className="">
                Elinor Silow was born in Malmö 1993. Currently lives and works
                in Stockholm.
                <span>
                  <Link
                    className="font-sans underline underline-offset-4 ml-1.5 hover:opacity-30 transition-opacity"
                    href="/"
                  >
                    Read more
                  </Link>
                </span>
              </p>
            </div>
            <div className="flex flex-col items-start justify-center">
              <Link href="/" className="font-serif-italic opacity-30">
                /contact
              </Link>

              <span className="flex items-start gap-3">
                <Link
                  className="font-sans text-lg hover:opacity-30 transition-opacity"
                  href="/"
                >
                  Email
                </Link>
                <Link
                  className="font-sans text-lg hover:opacity-30 transition-opacity"
                  href="/"
                >
                  Instagram
                </Link>
              </span>
            </div>

            <div className="flex flex-col items-start justify-center">
              <Link href="/" className="font-serif-italic opacity-30">
                /menu
              </Link>

              <nav className="flex flex-wrap items-start gap-3 w-full">
                <Link
                  className="font-sans text-3xl hover:opacity-30 transition-opacity"
                  href="/worksPage"
                >
                  works
                </Link>
                <Link
                  className="font-sans text-3xl hover:opacity-30 transition-opacity"
                  href="/"
                >
                  exhibitions
                </Link>
                <Link
                  className="font-sans text-3xl hover:opacity-30 transition-opacity"
                  href="/"
                >
                  information
                </Link>
                <Link
                  className="font-sans text-3xl hover:opacity-30 transition-opacity"
                  href="/"
                >
                  contact
                </Link>
                <Link
                  className="font-serif-italic hover:opacity-30 transition-opacity block lg:hidden "
                  href="/"
                >
                  dark mode
                </Link>
              </nav>
            </div>
          </div>
          <div className="hidden lg:flex  col-span-1"></div>
        </div>
      </div>
    </>
  );
}
