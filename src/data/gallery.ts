// Gallery data. Replace `src` with an image path (e.g. "/images/gallery/01.jpg") and edit title/description.
// `ratio` is width / height. `span` controls the desktop spatial layout.

export type GalleryItem = {
  id: string;
  title: string;
  description: string;
  src: string | null;
  ratio: number;
  hue: number;
  coord: string;
  span: "xl" | "lg" | "md" | "sm";
  rotate: number;
  depth: number;
};

const spec: Array<Pick<GalleryItem, "ratio" | "span" | "rotate" | "depth" | "hue">> = [
  { ratio: 1.5, span: "xl", rotate: -1.2, depth: 0, hue: 185 },
  { ratio: 0.75, span: "md", rotate: 1.8, depth: 40, hue: 265 },
  { ratio: 1, span: "sm", rotate: -2.4, depth: 80, hue: 325 },
  { ratio: 0.8, span: "lg", rotate: 1, depth: 20, hue: 85 },
  { ratio: 1.33, span: "md", rotate: -1.6, depth: 60, hue: 210 },
  { ratio: 1, span: "sm", rotate: 2.2, depth: 0, hue: 300 },
  { ratio: 1.78, span: "xl", rotate: 0.8, depth: 30, hue: 170 },
  { ratio: 0.67, span: "md", rotate: -2, depth: 70, hue: 340 },
  { ratio: 1.2, span: "lg", rotate: 1.4, depth: 10, hue: 250 },
  { ratio: 1, span: "sm", rotate: -1, depth: 50, hue: 120 },
];

export const galleryItems: GalleryItem[] = spec.map((s, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    id: `img-${n}`,
    title: `[IMAGE TITLE ${n}]`,
    description: "[IMAGE DESCRIPTION — add context, date or technique here.]",
    src: null,
    coord: `X ${String(((i * 137) % 900) + 100)} / Y ${String(((i * 251) % 900) + 100)}`,
    ...s,
  };
});
