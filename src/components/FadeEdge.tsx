// The page background fading out just below a fixed bar (put it inside the
// bar; the bar needs a position). The one fade for every fixed top element —
// the nav (works grid), the feed's title block, an exhibition's title — so
// they all look the same.
export default function FadeEdge() {
  return (
    <div
      aria-hidden
      className="absolute inset-x-0 top-full h-3 bg-linear-to-b from-background to-transparent pointer-events-none"
    />
  );
}
