"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Work, getWorkBySlug } from "../../../../lib/wordpress";
import { Loader } from "@/components/Loader";
import Image from "next/image";
import { useWorks } from "@/context/WorksContext";
import Header from "@/components/Header";

export default function WorkPage() {
  const params = useParams();
  const { allWorks } = useWorks();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [work, setWork] = useState<Work | null>(null);

  const [loading, setLoading] = useState(true);

  const [zoomed, setZoomed] = useState(false);

  const [min, setMin] = useState(true);
  useEffect(() => {
    async function fetchWork() {
      try {
        const currentWork = await getWorkBySlug(slug);
        setWork(currentWork);
      } catch (err) {
        console.error("Error fetching work:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWork();
  }, [slug, allWorks]);

  const currentIndex = allWorks.findIndex((w) => w.slug === slug);
  const prevWork = currentIndex > 0 ? allWorks[currentIndex - 1] : null;
  const nextWork =
    currentIndex < allWorks.length - 1 ? allWorks[currentIndex + 1] : null;

  if (loading) return <Loader />;
  if (!work) return <p>Work not found.</p>;

  const media = work._embedded?.["wp:featuredmedia"]?.[0];
  const imageUrl = media?.source_url || "/placeholder.jpg";
  return (
    <>
      <Header
        currentWork={work}
        currentWorkIndex={currentIndex}
        prevWork={prevWork}
        nextWork={nextWork}
        showInfo={true}
        min={min}
        setMin={setMin}
      />

      <div
        className={`w-screen h-screen flex flex-col items-center justify-center relative px-0 pt-0 pb-0  overflow-hidden `}
      >
        <div
          className={`relative w-full h-full  cursor-pointer`}
          onClick={() => setZoomed(!zoomed)}
        >
          <Image
            src={imageUrl}
            alt={work.title.rendered}
            fill
            className={`object-contain object-center p-24 lg:p-24 bg-black/95 ${
              zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
            }`}
            style={{
              transform: zoomed ? "scale(2)" : "scale(1)",
              transition: "transform 0.3s ease",
            }}
          />
        </div>
      </div>
    </>
  );
}
