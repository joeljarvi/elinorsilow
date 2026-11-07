export type WorkSize = "small" | "medium" | "large";

// A work's size category from its dimensions ("180 x 130 cm", "54 x 65 x 65
// cm"), by area of its two largest measurements: small under 60 × 60 cm,
// medium under 120 × 120 cm, large from there up. Null if it can't be read.
export function workSize(dimensions?: string): WorkSize | null {
  const [a, b] = (dimensions?.match(/\d+(?:[.,]\d+)?/g) ?? [])
    .map((n) => parseFloat(n.replace(",", ".")))
    .sort((x, y) => y - x);
  if (!a || !b) return null;
  const area = a * b;
  return area < 60 * 60 ? "small" : area < 120 * 120 ? "medium" : "large";
}
