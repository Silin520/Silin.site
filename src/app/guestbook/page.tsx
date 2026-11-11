import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { GuestbookClient } from "@/components/guestbook/GuestbookClient";
import { DataTicker } from "@/components/common/DataTicker";
import { pageIntro } from "@/data/site";

export const metadata: Metadata = { title: "Digital Guestbook" };

export default function GuestbookPage() {
  return (
    <>
      <PageHero
        index="S/04"
        eyebrow="SIGNALS / ARCHIVE"
        title="DIGITAL GUESTBOOK"
        subtitle={pageIntro.guestbook}
        tone="violet"
        aside={
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-dim">
            <span className="blink text-neon-lime">●</span> CHANNEL OPEN · <DataTicker length={8} />
          </p>
        }
      />
      <GuestbookClient />
    </>
  );
}
