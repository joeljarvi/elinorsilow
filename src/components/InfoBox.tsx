"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Work, Exhibition } from "../../lib/sanity";

export function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="h-[28px] flex flex-row items-center gap-x-[32px] py-0">
      <span className="font-universNextProExt font-extrabold text-[] lg:text-[13px] text-muted-foreground shrink-0">
        {label}
      </span>
      {children}
    </div>
  );
}

const rowAnim = {
  hidden: { opacity: 0, filter: "blur(6px)" },
  show: (i: number) => ({
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.3, delay: i * 0.06 },
  }),
};

function StaggerRow({
  value,
  index,
}: {
  label: string;
  value: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={rowAnim}
      className="h-auto lg:h-[28px] flex flex-row gap-x-4 items-baseline"
    >
      <span
        className={`text-[24px] leading-[1.2] lg:text-[15px] lg:leading-none break-words min-w-0 w-full block font-timesNewRoman ${index === 0 ? "" : ""}`}
      >
        {value}
      </span>
    </motion.div>
  );
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0 } },
};

export default function InfoBox({
  work,
  exhibition,
}: {
  work?: Work;
  exhibition?: Exhibition;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  if (work) {
    const rows = [
      { label: "Title", value: work.title.rendered },
      { label: "Year", value: work.acf.year },
      { label: "Medium", value: work.acf.materials },
      { label: "Dimensions", value: work.acf.dimensions },
      { label: "Exhibition", value: work.acf.exhibition },
    ].filter((r) => r.value);

    return (
      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="py-0 flex flex-col w-full items-start px-[0px] lg:items-start lg:px-0 gap-y-0 lg:text-left"
      >
        {rows.map((row, i) => (
          <StaggerRow
            key={row.label}
            label={row.label}
            value={row.value}
            index={i}
          />
        ))}
      </motion.div>
    );
  }

  if (exhibition) {
    const location = [exhibition.acf.location, exhibition.acf.city]
      .filter(Boolean)
      .join(", ");

    const rows = [
      { label: "Title", value: exhibition.title.rendered },
      { label: "Year", value: exhibition.acf.year },
      { label: "Venue", value: location },
    ].filter((r) => r.value);

    return (
      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        className="py-0 flex flex-col w-full"
      >
        {rows.map((row, i) => (
          <StaggerRow
            key={row.label}
            label={row.label}
            value={row.value}
            index={i}
          />
        ))}
      </motion.div>
    );
  }

  return null;
}
