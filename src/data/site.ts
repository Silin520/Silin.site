// Central site configuration. Replace placeholders here — pages read from this file.

export const siteConfig = {
  brand: "SILIN SPACE",
  tagline: "[YOUR TAGLINE]",
  introduction: "[YOUR INTRODUCTION]",
  email: "[YOUR EMAIL]",
  copyright: "[COPYRIGHT HOLDER] © [YEAR] — ALL RIGHTS RESERVED",
  // Set `href` to a real URL to activate a link. While null it renders as a disabled placeholder.
  socialLinks: [
    { label: "[SOCIAL 01]", href: null as string | null },
    { label: "[SOCIAL 02]", href: null as string | null },
    { label: "[SOCIAL 03]", href: null as string | null },
  ],
};

export const heroConfig = {
  headline: "[YOUR MAIN HEADLINE]",
  subtitle: "[YOUR PERSONAL INTRODUCTION]",
  tags: "DIGITAL CREATOR / DESIGN / EXPLORATION",
  /**
   * Portrait texture used by the Digital Phantom shader.
   * Replace the file at /public/images/portrait.jpg, or point this to any image in /public.
   * Set to null to use the procedural abstract silhouette.
   * Best results: high-contrast, light subject on a dark background, portrait aspect (9:16 – 3:4).
   */
  portrait: "/images/portrait.jpg" as string | null,
};

export const navItems = [
  { label: "HOME", href: "/" },
  { label: "BLOG", href: "/blog" },
  { label: "WORKS", href: "/works" },
  { label: "GALLERY", href: "/gallery" },
  { label: "GUESTBOOK", href: "/guestbook" },
];

export const aboutConfig = {
  title: "ABOUT",
  body: [
    "[ABOUT CONTENT]",
    "[ABOUT CONTENT — SECOND PARAGRAPH]",
  ],
  tags: ["[TAG 01]", "[TAG 02]", "[TAG 03]", "[TAG 04]"],
  focus: [
    { code: "F/01", label: "[FOCUS AREA 01]" },
    { code: "F/02", label: "[FOCUS AREA 02]" },
    { code: "F/03", label: "[FOCUS AREA 03]" },
  ],
};

export const pageIntro = {
  blog: "[BLOG INTRODUCTION]",
  works: "[WORKS INTRODUCTION]",
  gallery: "[GALLERY INTRODUCTION]",
  guestbook: "[GUESTBOOK INTRODUCTION]",
};
