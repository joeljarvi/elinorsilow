"use client";

import Link from "next/link";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed top-0 left-0 p-3 z-40 w-full bg-black  text-white">
        <div className="flex flex-row flex-wrap lg:flex-nowrap justify-between items-start w-full">
          <h1 className="font-haas uppercase min-w-sm w-auto lg:w-1/2">
            Admin Portal
          </h1>

          <nav className="flex flex-col items-start justify-start lg:flex-row lg:items-center  lg:justify-between w-full lg:w-1/2 uppercase">
            <Link href="/portal/works">Add Works</Link>
            <Link href="/portal/exhibitions">Add Exhibitions</Link>
            <Link href="/portal/information">Add Information</Link>

            <Link href="/">Back to home</Link>
          </nav>
        </div>
      </div>
      <main className="flex-1 p-3 mt-[50%] lg:mt-[12.5%] overflow-y-auto">
        {children}
      </main>
    </>
  );
}
