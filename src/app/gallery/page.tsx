import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { GalleryExperience } from "@/components/gallery/GalleryExperience";
import { galleryItems } from "@/data/gallery";
import { pageIntro } from "@/data/site";

export const metadata: Metadata = { title: "Visual Archive" };

export default function GalleryPage() {
  return (
    <>
      <PageHero
        index="G/03"
        eyebrow="IMAGES / ARCHIVE"
        title="VISUAL ARCHIVE"
        subtitle={pageIntro.gallery}
        tone="magenta"
        aside={
          <div className="space-y-1 text-right font-mono text-[0.65rem] uppercase tracking-[0.2em] text-dim">
            <p>FRAMES [{String(galleryItems.length).padStart(2, "0")}]</p>
            <p>CLICK TO ENTER VIEWER · ← → · ESC</p>
          </div>
        }
      />
      <GalleryExperience items={galleryItems} />
    </>
  );
}
