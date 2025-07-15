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

      <div className="w-screen h-screen font-serif flex flex-col items-start justify-center p-6">
        <Image
          src="/trumpet-gubbe.jpg"
          alt="drawing by Elinor Silow"
          width={179}
          height={281}
          className="object-cover"
        />
        <div className="flex flex-col items-start justify-center">
          <Link href="/" className="font-serif-italic opacity-30">
            /info
          </Link>
          <p className="">
            Elinor Silow was born in Malmö 1993. Currently lives and works in
            Stockholm.
            <span>
              <Link
                className="font-sans underline underline-offset-4 ml-1.5"
                href="/"
              >
                Read more
              </Link>
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
