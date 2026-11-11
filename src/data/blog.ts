// Blog data. Replace the array entries with real articles. `cover: null` renders the designed placeholder.

export type BlogBlock =
  | { type: "h2"; id: string; text: string }
  | { type: "p"; text: string }
  | { type: "quote"; text: string }
  | { type: "image"; caption: string; src: string | null };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  author: string;
  cover: string | null;
  hue: number;
  body: BlogBlock[];
};

export const blogCategories = ["ALL", "[CATEGORY A]", "[CATEGORY B]", "[CATEGORY C]"];

const placeholderBody: BlogBlock[] = [
  { type: "p", text: "[ARTICLE CONTENT — OPENING PARAGRAPH]" },
  { type: "h2", id: "section-01", text: "[SECTION HEADING 01]" },
  { type: "p", text: "[ARTICLE CONTENT — PARAGRAPH]" },
  { type: "p", text: "[ARTICLE CONTENT — PARAGRAPH]" },
  { type: "image", caption: "[IMAGE CAPTION]", src: null },
  { type: "h2", id: "section-02", text: "[SECTION HEADING 02]" },
  { type: "quote", text: "[PULL QUOTE]" },
  { type: "p", text: "[ARTICLE CONTENT — PARAGRAPH]" },
  { type: "h2", id: "section-03", text: "[SECTION HEADING 03]" },
  { type: "p", text: "[ARTICLE CONTENT — CLOSING PARAGRAPH]" },
];

const cats = blogCategories.slice(1);
const hues = [185, 265, 325, 85, 200, 290, 340, 150];

export const blogPosts: BlogPost[] = Array.from({ length: 8 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return {
    slug: `article-${n}`,
    title: `[ARTICLE TITLE ${n}]`,
    excerpt: "[ARTICLE EXCERPT — a short summary of the article goes here.]",
    category: cats[i % cats.length],
    tags: [`[TAG ${i % 2 ? "A" : "B"}]`, `[TAG ${i % 3 ? "C" : "D"}]`],
    date: "[YYYY.MM.DD]",
    readTime: "[X] MIN READ",
    author: "[AUTHOR NAME]",
    cover: null,
    hue: hues[i % hues.length],
    body: placeholderBody,
  };
});

export function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAdjacentPosts(slug: string) {
  const i = blogPosts.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? blogPosts[i - 1] : null,
    next: i >= 0 && i < blogPosts.length - 1 ? blogPosts[i + 1] : null,
  };
}
