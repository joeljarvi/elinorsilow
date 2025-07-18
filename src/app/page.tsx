"use client";

import { Header } from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useAnimationContext } from "@/context/AnimationContext";
import { motion } from "framer-motion";

export default function HomePage() {
  const [openTools, setOpenTools] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const { revealStep, startRevealSequence } = useAnimationContext();

  useEffect(() => {
    startRevealSequence();
  }, [startRevealSequence]);
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
      <div className="w-screen h-screen font-serif flex flex-col items-center justify-center ">
        <div className="grid grid-cols-2 w-full h-full ">
          <div className="col-span-2 lg:col-span-1 flex flex-col items-start justify-center  gap-y-6 p-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={revealStep >= 2 ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <Image
                src="/elli_trumpetgubbe.jpg"
                alt="drawing by Elinor Silow"
                width={1713}
                height={2697}
                loading="lazy"
                className="max-w-1/3 object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={revealStep >= 3 ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-start justify-center w-full lg:max-w-2/3"
            >
              <Link href="/" className="font-serif-italic opacity-30">
                /info
              </Link>
              <p className="">
                Elinor Silow was born in Malmö 1993. Currently lives and works
                in Stockholm.
                <span>
                  <Link
                    className="font-sans underline underline-offset-4 ml-1.5 hover:opacity-30 transition-all"
                    href="/"
                  >
                    Read more
                  </Link>
                </span>
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={revealStep >= 4 ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-start justify-center"
            >
              <Link href="/" className="font-serif-italic opacity-30">
                /contact
              </Link>

              <span className="flex items-start gap-3">
                <Link
                  className="font-sans text-lg hover:opacity-30 transition-all hover:underline underline-offset-6"
                  href="mailto:elinor.silow@gmail.com"
                >
                  Email
                </Link>
                <Link
                  className="font-sans text-lg hover:opacity-30 transition-all hover:underline underline-offset-6"
                  href="https://www.instagram.com/elinorsilow/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </Link>
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={revealStep >= 5 ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="flex lg:hidden flex-col items-start justify-center"
            >
              <Link href="/" className="font-serif-italic opacity-30">
                /menu
              </Link>

              <nav className="flex  flex-wrap items-start justify-start gap-x-6 gap-y-1.5 w-full text-xl uppercase">
                <Link
                  className="font-sans hover:opacity-30 transition-all hover:underline underline-offset-6"
                  href="/works"
                >
                  works
                </Link>
                <Link
                  className="font-sans hover:opacity-30 transition-all hover:underline underline-offset-6"
                  href="/exhibitions"
                >
                  exhibitions
                </Link>
                <Link
                  className="font-sans hover:opacity-30 transition-all hover:underline underline-offset-6"
                  href="/"
                >
                  information
                </Link>
                <Link
                  className="font-sans hover:opacity-30 transition-all hover:underline underline-offset-6"
                  href="/"
                >
                  contact
                </Link>
              </nav>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={revealStep >= 5 ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex  col-span-1 bg-black"
          ></motion.div>
        </div>
      </div>
    </>
  );
}
