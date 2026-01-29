"use client";

import { useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { toPng } from "html-to-image";

const ASPECTS = {
  "aspect-video": { cols: 16, rows: 9 },
  "aspect-square": { cols: 10, rows: 10 },
  "aspect-3/4": { cols: 9, rows: 12 },
} as const;

const EXPORT_SIZES = {
  "aspect-video": { width: 1920, height: 1080 },
  "aspect-square": { width: 1080, height: 1080 },
  "aspect-3/4": { width: 1080, height: 1440 },
} as const;

type ColorMode = "white-on-black" | "black-on-white" | "black-on-transparent";

export default function PlaceholderMaker() {
  const imageRef = useRef<HTMLDivElement>(null);

  const [text, setText] = useState("PLACEHOLDER");
  const [aspect, setAspect] = useState<keyof typeof ASPECTS>("aspect-video");
  const [seed, setSeed] = useState(0);
  const [colorMode, setColorMode] = useState<ColorMode>("white-on-black");

  const { cols, rows } = ASPECTS[aspect];
  const { width, height } = EXPORT_SIZES[aspect];

  // Word layout (wraps automatically)
  const layout = useMemo(() => {
    const letters = text.toUpperCase().split("");
    const totalCells = cols * rows;
    const maxStart = Math.max(totalCells - letters.length, 0);
    const startIndex = Math.floor(Math.random() * (maxStart + 1));

    return { letters, startIndex };
  }, [text, aspect, cols, rows, seed]);

  const bgClass =
    colorMode === "white-on-black"
      ? "bg-black"
      : colorMode === "black-on-white"
      ? "bg-white"
      : "bg-transparent";

  const textClass =
    colorMode === "white-on-black" ? "text-white" : "text-black";

  const Grid = ({ scaled = false }: { scaled?: boolean }) => (
    <div
      className={clsx("grid", bgClass)}
      style={{
        width,
        height,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        transform: scaled ? "scale(0.50)" : undefined,
        transformOrigin: "top left",
      }}
    >
      {Array.from({ length: cols * rows }).map((_, index) => {
        const letterIndex = index - layout.startIndex;
        const letter =
          letterIndex >= 0 && letterIndex < layout.letters.length
            ? layout.letters[letterIndex]
            : "";

        return (
          <div
            key={index}
            className={clsx(
              "flex items-center justify-center font-black select-none ",
              textClass
            )}
          >
            {letter}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <h1 className="text-xl font-semibold">Placeholder Maker</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border px-3 py-1 rounded"
          placeholder="Enter word"
        />

        {Object.keys(ASPECTS).map((key) => (
          <button
            key={key}
            onClick={() => setAspect(key as any)}
            className={clsx(
              "px-3 py-1 border",
              aspect === key && "bg-black text-white"
            )}
          >
            {key}
          </button>
        ))}

        {(
          [
            "white-on-black",
            "black-on-white",
            "black-on-transparent",
          ] as ColorMode[]
        ).map((mode) => (
          <button
            key={mode}
            onClick={() => setColorMode(mode)}
            className={clsx(
              "px-3 py-1 border",
              colorMode === mode && "bg-black text-white"
            )}
          >
            {mode}
          </button>
        ))}

        <button
          onClick={() => setSeed((s) => s + 1)}
          className="px-3 py-1 border"
        >
          Regenerate
        </button>

        <button
          onClick={async () => {
            if (!imageRef.current) return;

            const dataUrl = await toPng(imageRef.current, {
              width,
              height,
              pixelRatio: 1,
              backgroundColor:
                colorMode === "black-on-transparent"
                  ? "transparent"
                  : undefined,
            });

            const link = document.createElement("a");
            link.download = `${text.toLowerCase()}-${aspect}.png`;
            link.href = dataUrl;
            link.click();
          }}
          className="px-3 py-1 border"
        >
          Save PNG
        </button>
      </div>

      {/* Preview + Export */}
      <div className="flex gap-6 items-start">
        {/* Preview */}
        <div className="border overflow-hidden">
          <Grid scaled />
        </div>

        {/* Export (hidden size reference but visible if you want) */}
        <div className="border hidden">
          <div ref={imageRef}>
            <Grid />
          </div>
        </div>

        {/* Export ref (must be rendered once) */}
        <div className="absolute left-[-99999px] top-0">
          <div ref={imageRef}>
            <Grid />
          </div>
        </div>
      </div>
    </div>
  );
}
