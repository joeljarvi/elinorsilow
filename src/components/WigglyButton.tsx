"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import * as opentype from "opentype.js";
import { cn } from "@/lib/utils";
import { useUI } from "@/context/UIContext";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

interface WigglyButtonProps {
  text: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  href?: string;
  vertical?: boolean;
  justify?: boolean;
  spreading?: boolean;
  className?: string;
  size?: string;
  bold?: boolean;
  revealAnimation?: boolean;
  active?: boolean;
  textShadow?: boolean;
  stroke?: string;
  strokeWidth?: number;
  sizeGradient?: { from: number; to: number };
  wiggleGradient?: boolean;
  target?: string;
  rel?: string;
  scrollTilt?: boolean;
  mobileSize?: string;
  showAnchors?: boolean;
  letterFill?: string;
  anchorFill?: string;
  forceBaseline?: boolean;
  forceBoring?: boolean;
  loopingWave?: boolean;
  forceMono?: boolean;
}

// ── Font singletons (regular + bold) ─────────────────────────────────────────
const _cache: Record<string, opentype.Font | null> = {};
const _promises: Record<string, Promise<opentype.Font> | null> = {};
const _subscribers: Record<string, Set<() => void>> = {
  regular: new Set(),
  bold: new Set(),
};

function loadFontVariant(variant: "regular" | "bold"): Promise<opentype.Font> {
  if (_cache[variant]) return Promise.resolve(_cache[variant]!);
  if (!_promises[variant]) {
    const url = variant === "bold" ? "/fonts/tnr-bold.otf" : "/fonts/tnr.otf";
    _promises[variant] = fetch(url)
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        _cache[variant] = opentype.parse(buf);
        _subscribers[variant].forEach((cb) => cb());
        return _cache[variant]!;
      });
  }
  return _promises[variant]!;
}

function useFont(bold: boolean): opentype.Font | null {
  const variant = bold ? "bold" : "regular";
  const [font, setFont] = useState<opentype.Font | null>(
    _cache[variant] ?? null,
  );
  useEffect(() => {
    if (_cache[variant]) {
      setFont(_cache[variant]);
      return;
    }
    const notify = () => setFont(_cache[variant]);
    _subscribers[variant].add(notify);
    loadFontVariant(variant).catch(() => {});
    return () => {
      _subscribers[variant].delete(notify);
    };
  }, [variant]);
  return font;
}

// ── Fun colors ───────────────────────────────────────────────────────────────
const FUN_COLORS = ["#e63946", "#2a9d8f", "#e9c46a", "#f4a261", "#a8dadc", "#c77dff"];
function funColor(index: number): string {
  return FUN_COLORS[index % FUN_COLORS.length];
}

// ── Letter-spacing extraction ─────────────────────────────────────────────────
const TRACKING_EM: Record<string, number> = {
  "tracking-tighter": -0.05,
  "tracking-tight": -0.025,
  "tracking-normal": 0,
  "tracking-wide": 0.025,
  "tracking-wider": 0.05,
  "tracking-widest": 0.1,
};

function parseLetterSpacing(
  className: string | undefined,
  fontSize: number,
): number {
  if (!className) return 0;
  for (const [cls, em] of Object.entries(TRACKING_EM)) {
    if (className.includes(cls)) return em * fontSize;
  }
  const m = className.match(/tracking-\[(-?[\d.]+)(px|em)\]/);
  if (m) {
    const val = parseFloat(m[1]);
    return m[2] === "em" ? val * fontSize : val;
  }
  return 0;
}

// ── Line-height extraction ────────────────────────────────────────────────────
const LEADING_EM: Record<string, number> = {
  "leading-none": 1,
  "leading-tight": 1.25,
  "leading-snug": 1.375,
  "leading-normal": 1.5,
  "leading-relaxed": 1.625,
  "leading-loose": 2,
};

function parseLeading(cls: string | undefined, fontSize: number): number | null {
  if (!cls) return null;
  for (const [name, ratio] of Object.entries(LEADING_EM)) {
    if (cls.includes(name)) return ratio * fontSize;
  }
  const m = cls.match(/leading-\[(\d+(?:\.\d+)?)(px|rem)\]/);
  if (m) {
    const val = parseFloat(m[1]);
    return m[2] === "rem" ? val * 16 : val;
  }
  return null;
}

// ── Font-size extraction ──────────────────────────────────────────────────────
function parseFontSize(size: string): number {
  const m = size.match(/\[(\d+(?:\.\d+)?)px\]/);
  if (m) return parseFloat(m[1]);
  const map: Record<string, number> = {
    "text-xs": 12,
    "text-sm": 14,
    "text-base": 16,
    "text-lg": 18,
    "text-xl": 20,
    "text-2xl": 24,
    "text-3xl": 30,
    "text-4xl": 36,
    "text-5xl": 48,
    "text-6xl": 60,
    "text-7xl": 72,
    "text-8xl": 96,
    "text-9xl": 128,
  };
  return map[size.trim()] ?? 16;
}

// ── SVG layout ────────────────────────────────────────────────────────────────
interface GlyphItem {
  pathData: string;
  x: number;
  cx: number; // center x for transform-origin
  ty: number;
  scale: number;
  scaleX: number;
  h: number;
  anchors: Array<{ x: number; y: number }>; // pixel-space on-curve points
}

type RawGlyph = Omit<GlyphItem, "ty" | "anchors"> & {
  ascent: number;
  rawAnchors: Array<{ fx: number; fy: number }>; // font-unit on-curve points
};

function getRefWidths(font: opentype.Font, fontSize: number): [number, number, number] {
  function adv(ch: string): number {
    try {
      const g = font.charToGlyph(ch);
      return ((g.advanceWidth ?? font.unitsPerEm) / font.unitsPerEm) * fontSize;
    } catch {
      return fontSize;
    }
  }
  return [adv("I"), adv("X"), adv("M")];
}

function pickRefWidth(refs: [number, number, number], charCode: number, index: number): number {
  const h = ((charCode * 1664525 + index * 1013904223) >>> 0) % 3;
  return refs[h];
}

function buildSansMonoSpans(
  font: opentype.Font,
  text: string,
  fontSize: number,
): Array<{ ch: string; cellPx: number; stretch: number; isSpace: boolean }> {
  const refWidths = getRefWidths(font, fontSize);
  return text.split("").map((ch, i) => {
    const isSpace = ch === " ";
    const cellPx = pickRefWidth(refWidths, isSpace ? 32 : ch.charCodeAt(0), i);
    let stretch = 1;
    if (!isSpace) {
      try {
        const g = font.charToGlyph(ch);
        const naturalAdvPx = ((g.advanceWidth ?? font.unitsPerEm) / font.unitsPerEm) * fontSize;
        stretch = cellPx / naturalAdvPx;
      } catch {}
    }
    return { ch, cellPx, stretch, isSpace };
  });
}

function buildLayout(
  font: opentype.Font,
  text: string,
  fontSize: number,
  letterSpacing: number,
  sizeGradient?: { from: number; to: number },
  baselineAlign?: boolean,
  forceMono?: boolean,
): { glyphs: GlyphItem[]; svgW: number; svgH: number } {
  const chars = text.split("");
  const raw: RawGlyph[] = [];
  let x = 0;
  let svgH = 0;

  const refWidths = forceMono ? getRefWidths(font, fontSize) : null;

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const t = chars.length > 1 ? i / (chars.length - 1) : 0;
    const fs = sizeGradient
      ? sizeGradient.from + (sizeGradient.to - sizeGradient.from) * t
      : fontSize;
    const sc = fs / font.unitsPerEm;

    if (ch === " ") {
      x += refWidths ? pickRefWidth(refWidths, 32, i) : fs * 0.3;
      continue;
    }
    try {
      const glyph = font.charToGlyph(ch);
      const bb = glyph.getBoundingBox();
      const naturalAdv = glyph.advanceWidth ?? font.unitsPerEm;
      const adv = (naturalAdv / font.unitsPerEm) * fs;
      const cellWidth = refWidths ? pickRefWidth(refWidths, ch.charCodeAt(0), i) : adv;
      const scaleX = refWidths ? cellWidth / naturalAdv : sc;
      const ascent = bb.y2 * sc;
      const h = (bb.y2 - bb.y1) * sc;
      const pathData = glyph.path.toPathData(2);
      const rawAnchors: Array<{ fx: number; fy: number }> = [];
      const cmds = (glyph.path as opentype.Path & { commands: Array<{ type: string; x?: number; y?: number }> }).commands;
      for (const cmd of cmds) {
        if (['M', 'L', 'Q', 'C'].includes(cmd.type) && cmd.x !== undefined && cmd.y !== undefined) {
          rawAnchors.push({ fx: cmd.x, fy: cmd.y });
        }
      }
      raw.push({ pathData, x, cx: x + cellWidth / 2, ascent, scale: sc, scaleX, h, rawAnchors });
      if (h > svgH) svgH = h;
      x += cellWidth + letterSpacing;
    } catch {
      x += refWidths ? pickRefWidth(refWidths, 0, i) : fs * 0.5;
    }
  }

  const maxAscent = raw.reduce((m, g) => Math.max(m, g.ascent), 0);

  const glyphs: GlyphItem[] = raw.map((g) => {
    const ty = baselineAlign ? maxAscent : g.ascent + (svgH - g.h) / 2;
    const anchors = g.rawAnchors.map(({ fx, fy }) => ({
      x: g.x + fx * g.scaleX,
      y: ty - fy * g.scale,
    }));
    return { pathData: g.pathData, x: g.x, cx: g.cx, ty, scale: g.scale, scaleX: g.scaleX, h: g.h, anchors };
  });

  return { glyphs, svgW: x, svgH };
}


// ── Per-letter scroll-tilt ────────────────────────────────────────────────────
const TILT_STAGGER_PX = 30;  // extra scroll px before each successive letter starts
const TILT_SPEED = 0.1;      // degrees per scroll px

function LetterGlyph({
  glyph,
  index,
  svgH,
  scrollY,
  stroke,
  strokeWidth,
  scrollTilt,
  fill,
  showAnchors,
  anchorR,
  anchorFill,
  inactive,
  hovered,
  loopingWave,
  distortRotate,
  distortY,
  distorted: distortedProp,
  distortDelay,
}: {
  glyph: GlyphItem;
  index: number;
  svgH: number;
  scrollY: MotionValue<number>;
  stroke?: string;
  strokeWidth?: number;
  scrollTilt?: boolean;
  fill?: string;
  showAnchors?: boolean;
  anchorR?: number;
  anchorFill?: string;
  inactive?: boolean;
  hovered?: boolean;
  loopingWave?: boolean;
  distortRotate?: number;
  distortY?: number;
  distorted?: boolean;
  distortDelay?: number;
}) {
  const transform = useTransform(scrollY, (v) => {
    if (!scrollTilt) return "none";
    const angle = Math.max(0, v - index * TILT_STAGGER_PX) * TILT_SPEED;
    return `perspective(400px) rotateY(${angle}deg)`;
  });

  const R = anchorR ?? 2.5;
  const waveAmplitude = svgH * 0.18;

  return (
    <motion.g
      animate={{
        rotate: distortedProp ? (distortRotate ?? 0) : 0,
        y: distortedProp ? (distortY ?? 0) : 0,
      }}
      transition={{ duration: 0.18, ease: "easeOut", delay: distortDelay ?? 0 }}
      style={{ transformOrigin: `${glyph.cx}px ${svgH / 2}px` }}
    >
    <motion.g
      style={{ isolation: "isolate" } as CSSProperties}
      animate={loopingWave ? { y: [0, -waveAmplitude, 0] } : { y: 0 }}
      transition={loopingWave ? {
        duration: 1.8,
        ease: "easeInOut",
        repeat: Infinity,
        delay: index * 0.1,
        repeatDelay: 0,
      } : { duration: 0 }}
    >
      <motion.g
        style={{
          transform,
          transformOrigin: `${glyph.cx}px ${svgH / 2}px`,
        }}
      >
        <motion.g
          initial={false}
          animate={{ scaleX: hovered ? (glyph.scale / glyph.scaleX) : 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{ transformOrigin: `${glyph.cx}px ${svgH / 2}px` }}
        >
          <g
            transform={`translate(${glyph.x},${glyph.ty}) scale(${glyph.scaleX},${-glyph.scale})`}
            fill={fill ?? "currentColor"}
          >
            <path
              d={glyph.pathData}
              style={stroke ? {
                stroke,
                strokeWidth: strokeWidth ?? 1,
                vectorEffect: "non-scaling-stroke",
              } : undefined}
            />
          </g>
        </motion.g>
      </motion.g>
      {showAnchors && glyph.anchors.map((pt, pi) => (
        <motion.rect
          key={pi}
          initial={false}
          animate={{ opacity: inactive ? 0 : 1 }}
          transition={{ duration: inactive ? 0.8 : 0.3 }}
          x={pt.x - R}
          y={pt.y - R}
          width={R * 2}
          height={R * 2}
          fill={anchorFill ?? "black"}
          style={anchorFill ? undefined : { mixBlendMode: "difference" as CSSProperties["mixBlendMode"] }}
        />
      ))}
    </motion.g>
    </motion.g>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function WigglyButton({
  text,
  onClick,
  href,
  className,
  size = "text-[16px]",
  bold = false,
  textShadow,
  stroke,
  strokeWidth,
  sizeGradient,
  // accepted but unused after wiggle removal:
  vertical: _vertical,
  justify: _justify,
  spreading: _spreading,
  revealAnimation: _revealAnimation,
  active,
  wiggleGradient,
  target,
  rel,
  scrollTilt,
  mobileSize,
  showAnchors,
  letterFill,
  anchorFill,
  forceBaseline,
  forceBoring,
  loopingWave,
  forceMono,
}: WigglyButtonProps) {
  const { boring, moreFun, sans, small, funForeground, showAnchorsAll, inactive } = useUI();
  const effectiveMoreFun = forceBoring ? false : (moreFun || funForeground);
  const effectiveShowAnchors = forceBoring ? showAnchors : (showAnchors || showAnchorsAll);
  const effectiveSize = small ? "text-lg" : size;
  const effectiveMobileSize = small ? "text-base" : mobileSize;
  const font = useFont(bold);
  const fontSize = parseFontSize(effectiveSize);
  const mobileFontSize = effectiveMobileSize ? parseFontSize(effectiveMobileSize) : null;
  const letterSpacing = parseLetterSpacing(className, fontSize);
  const baselineAlign = forceBaseline || boring || !active;
  const layout = font
    ? buildLayout(font, text, fontSize, letterSpacing, sizeGradient, baselineAlign, forceMono)
    : null;
  const mobileLayout =
    font && mobileFontSize
      ? buildLayout(font, text, mobileFontSize, parseLetterSpacing(className, mobileFontSize), sizeGradient, baselineAlign, forceMono)
      : null;
  const { scrollY } = useScroll();
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const distortions = useRef<Array<{ rotate: number; y: number }>>([]);

  useEffect(() => {
    const count = text.split("").filter((c) => c !== " ").length;
    distortions.current = Array.from({ length: count }, () => ({
      rotate: parseFloat((Math.random() * 14 - 7).toFixed(1)),
      y: parseFloat((Math.random() * 6 - 3).toFixed(1)),
    }));
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const distorted = mounted && !!(active || hovered);

  function makeSvg(l: NonNullable<typeof layout>, wrapperClass?: string) {
    const R = 1;
    const leadingH = parseLeading(className, fontSize);
    const displayH = leadingH && leadingH > l.svgH ? leadingH : l.svgH;
    const vbTop = leadingH && leadingH > l.svgH
      ? forceBaseline ? -(leadingH - l.svgH) : -(leadingH - l.svgH) / 2
      : 0;
    const vAlign = forceBaseline ? "baseline" : "middle";
    return (
      <span
        className={wrapperClass}
        style={{ display: wrapperClass ? undefined : "inline-flex", verticalAlign: vAlign }}
      >
        <svg
          width={l.svgW}
          height={displayH}
          viewBox={`0 ${vbTop} ${l.svgW} ${displayH}`}
          aria-hidden="true"
          style={{ display: "inline-flex", verticalAlign: vAlign, overflow: "visible" }}
        >
          {l.glyphs.map((g, i) => {
            const wf = wiggleGradient ? 0.5 * (1 - i / Math.max(l.glyphs.length - 1, 1)) : 1;
            return (
              <LetterGlyph
                key={i}
                glyph={g}
                index={i}
                svgH={l.svgH}
                scrollY={scrollY}
                stroke={stroke}
                strokeWidth={strokeWidth}
                scrollTilt={scrollTilt}
                fill={moreFun ? funColor(i) : letterFill}
                showAnchors={effectiveShowAnchors}
                anchorR={R}
                anchorFill={anchorFill}
                inactive={inactive}
                hovered={hovered}
                loopingWave={loopingWave}
                distortRotate={(distortions.current[i]?.rotate ?? 0) * wf}
                distortY={(distortions.current[i]?.y ?? 0) * wf}
                distorted={distorted}
                distortDelay={distorted ? i * 0.015 : 0}
              />
            );
          })}
        </svg>
      </span>
    );
  }

  const inner = sans ? (
    (effectiveMoreFun && font) ? (
      <span
        className={cn("font-haas", effectiveSize, bold ? "font-bold" : "font-normal")}
        style={{ whiteSpace: "nowrap", display: "inline-block" }}
      >
        {buildSansMonoSpans(font, text, fontSize).map(({ ch, cellPx, stretch, isSpace }, i) =>
          isSpace ? (
            <span key={i} style={{ display: "inline-block", width: `${cellPx}px` }}>{" "}</span>
          ) : (
            <span key={i} style={{ display: "inline-block", width: `${cellPx}px`, color: moreFun ? funColor(i) : undefined }}>
              <span style={{ display: "inline-block", transform: `scaleX(${stretch})`, transformOrigin: "left center" }}>
                {ch}
              </span>
            </span>
          )
        )}
      </span>
    ) : (
      <span
        className={cn(
          "font-haas",
          boring ? "tracking-normal" : "tracking-wide",
          effectiveSize,
          bold ? "font-bold" : "font-normal",
        )}
      >
        {text}
      </span>
    )
  ) : layout ? (
    mobileLayout ? (
      <>
        {makeSvg(mobileLayout, "lg:hidden inline-flex")}
        {makeSvg(layout, "hidden lg:inline-flex")}
      </>
    ) : makeSvg(layout)
  ) : (
    <span
      style={{ opacity: 0 }}
      className={cn("font-timesNewRoman tracking-wider", size, bold ? "font-bold" : "font-normal")}
    >
      {text}
    </span>
  );

  const base = cn(
    "pointer-events-auto cursor-pointer px-[9px] inline-flex",
    forceBaseline ? "items-baseline" : "items-center",
    textShadow && "text-shadow-md",
    effectiveMoreFun && "whitespace-normal",
    className,
  );

  if (href) {
    return (
      <Link
        href={href} target={target} rel={rel} data-no-reveal className={base}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      data-no-reveal
      className={base}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {inner}
    </button>
  );
}
