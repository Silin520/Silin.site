// Works data. Replace entries with real projects. Categories are configurable.

export type Work = {
  slug: string;
  title: string;
  category: string;
  year: string;
  summary: string;
  cover: string | null;
  hue: number;
  size: "lg" | "md" | "sm";
  stack: string[];
  background: string;
  goals: string;
  process: string;
  result: string;
  images: (string | null)[];
};

export const workCategories = ["ALL", "DESIGN", "DEVELOPMENT", "EXPERIMENT", "OTHER"];

const cats = ["DESIGN", "DEVELOPMENT", "EXPERIMENT", "OTHER", "DESIGN", "EXPERIMENT"];
const sizes: Work["size"][] = ["lg", "sm", "md", "md", "sm", "lg"];
const hues = [185, 265, 325, 85, 210, 300];

export const works: Work[] = Array.from({ length: 6 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    slug: `project-${n}`,
    title: `[PROJECT TITLE ${n}]`,
    category: cats[i],
    year: "[YEAR]",
    summary: "[PROJECT SUMMARY — one or two sentences describing the work.]",
    cover: null,
    hue: hues[i],
    size: sizes[i],
    stack: ["[TECH 01]", "[TECH 02]", "[TECH 03]"],
    background: "[PROJECT BACKGROUND]",
    goals: "[DESIGN GOALS]",
    process: "[IMPLEMENTATION PROCESS]",
    result: "[FINAL RESULT]",
    images: [null, null, null],
  };
});

export function getWork(slug: string) {
  return works.find((w) => w.slug === slug);
}

export function getRelatedWorks(slug: string, limit = 3) {
  const current = getWork(slug);
  const others = works.filter((w) => w.slug !== slug);
  others.sort((a, b) => Number(b.category === current?.category) - Number(a.category === current?.category));
  return others.slice(0, limit);
}
