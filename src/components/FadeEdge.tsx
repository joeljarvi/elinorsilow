// The page background fading out from the edge of a fixed bar (put it inside
// the bar; the bar needs a position): below it (side "bottom", the default —
// a bar at the top) or above it (side "top" — a bar at the bottom). The one
// fade for every fixed element, so they all look the same.
export default function FadeEdge({
  className = "",
  side = "bottom",
}: {
  className?: string;
  side?: "bottom" | "top";
}) {
  return (
    <div
      aria-hidden
      className={`absolute inset-x-0 h-3 from-background to-transparent pointer-events-none ${side === "top" ? "bottom-full bg-linear-to-t" : "top-full bg-linear-to-b"} ${className}`}
    />
  );
}
