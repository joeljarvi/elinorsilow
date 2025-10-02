import { Exhibition } from "../../../../../lib/wordpress";

export type ExhibitionWithImage = Exhibition & {
  image_url: string;
};

export function normalizeExhibitions(
  data: Exhibition[]
): ExhibitionWithImage[] {
  return data.map((ex) => {
    const firstImage = [
      ex.acf.image_1,
      ex.acf.image_2,
      ex.acf.image_3,
      ex.acf.image_4,
      ex.acf.image_5,
      ex.acf.image_6,
      ex.acf.image_7,
      ex.acf.image_8,
      ex.acf.image_9,
      ex.acf.image_10,
    ].find((img) => img?.url)?.url;

    return {
      ...ex,
      image_url: firstImage || "",
    };
  });
}
